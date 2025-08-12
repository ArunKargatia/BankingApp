package com.ak.BankingApp.service.impl;

import com.ak.BankingApp.config.JWTService;
import com.ak.BankingApp.dto.AccountAmountDTO;
import com.ak.BankingApp.dto.TransactionDTO;
import com.ak.BankingApp.dto.TransferDTO;
import com.ak.BankingApp.entity.Account;
import com.ak.BankingApp.entity.Transaction;
import com.ak.BankingApp.enums.TransactionType;
import com.ak.BankingApp.mapper.TransactionMapper;
import com.ak.BankingApp.repository.AccountRepository;
import com.ak.BankingApp.repository.TransactionRepository;
import com.ak.BankingApp.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private JWTService jwtService;

    @Override
    @Transactional
    public void createDeposit(AccountAmountDTO accountAmountDto) {
        String token = extractTokenFromSecurityContext();
        Long customerId = jwtService.extractCustomerId(token);

        Account account = accountRepository.findByAccountNumber(accountAmountDto.getAccountNumber())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found with number: " + accountAmountDto.getAccountNumber()));

        if (!account.getCustomer().getId().equals(customerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized: Account does not belong to the authenticated customer.");
        }

        if (accountAmountDto.getAmount() == null || (accountAmountDto.getAmount().compareTo(BigDecimal.ZERO) <= 0)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be greater than 0.");
        }

        account.setBalance(account.getBalance().add(accountAmountDto.getAmount()));
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(accountAmountDto.getAmount());
        transaction.setTransactionType(TransactionType.DEPOSIT);
        transaction.setDescription("Deposit to account");
        transaction.setTargetAccountId(null);
        transaction.setCreatedAt(LocalDateTime.now());

        transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public void createWithdrawal(AccountAmountDTO accountAmountDto) {
        String token = extractTokenFromSecurityContext();
        Long customerId = jwtService.extractCustomerId(token);

        Account account = accountRepository.findByAccountNumber(accountAmountDto.getAccountNumber())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found with number: " + accountAmountDto.getAccountNumber()));

        if (!account.getCustomer().getId().equals(customerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized: Account does not belong to the authenticated customer.");
        }

        if (accountAmountDto.getAmount() == null || accountAmountDto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be greater than 0.");
        }

        if (account.getBalance().compareTo(accountAmountDto.getAmount()) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient balance.");
        }

        account.setBalance(account.getBalance().subtract(accountAmountDto.getAmount()));
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(accountAmountDto.getAmount());
        transaction.setTransactionType(TransactionType.WITHDRAWAL);
        transaction.setDescription("Withdrawal from account");
        transaction.setTargetAccountId(null);
        transaction.setCreatedAt(LocalDateTime.now());

        transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public void transferFunds(TransferDTO transferDto) {
        String token = extractTokenFromSecurityContext();
        Long customerId = jwtService.extractCustomerId(token);

        if (transferDto.getFromAccountNumber().equals(transferDto.getToAccountNumber())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot transfer to the same account.");
        }

        Account sender = accountRepository.findByAccountNumber(transferDto.getFromAccountNumber())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender account not found."));

        if (!sender.getCustomer().getId().equals(customerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized transaction: Sender account does not belong to you.");
        }

        Account receiver = accountRepository.findByAccountNumber(transferDto.getToAccountNumber())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receiver account not found."));

        if (transferDto.getAmount() == null || transferDto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be greater than 0.");
        }

        if (sender.getBalance().compareTo(transferDto.getAmount()) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient balance.");
        }

        sender.setBalance(sender.getBalance().subtract(transferDto.getAmount()));
        receiver.setBalance(receiver.getBalance().add(transferDto.getAmount()));
        accountRepository.save(sender);
        accountRepository.save(receiver);

        Transaction senderTransaction = new Transaction();
        senderTransaction.setAccount(sender);
        senderTransaction.setAmount(transferDto.getAmount());
        senderTransaction.setTransactionType(TransactionType.TRANSFER);
        senderTransaction.setDescription("Transfer to account " + receiver.getAccountNumber());
        senderTransaction.setTargetAccountId(receiver.getId());
        senderTransaction.setCreatedAt(LocalDateTime.now());

        Transaction receiverTransaction = new Transaction();
        receiverTransaction.setAccount(receiver);
        receiverTransaction.setAmount(transferDto.getAmount());
        receiverTransaction.setTransactionType(TransactionType.DEPOSIT);
        receiverTransaction.setDescription("Received from account " + sender.getAccountNumber());
        receiverTransaction.setTargetAccountId(sender.getId());
        receiverTransaction.setCreatedAt(LocalDateTime.now());

        transactionRepository.save(senderTransaction);
        transactionRepository.save(receiverTransaction);
    }

    @Override
    public List<TransactionDTO> getAllTransaction() {
        String token = extractTokenFromSecurityContext();
        Long customerId = jwtService.extractCustomerId(token);

        List<Account> accounts = accountRepository.findByCustomerId(customerId);
        if (accounts.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No accounts found for this customer.");
        }

        List<Long> accountIds = accounts.stream()
                                    .map(Account::getId)
                                    .toList();

        List<Transaction> transactions = transactionRepository.findDistinctByAccountIdInOrTargetAccountIdIn(accountIds, accountIds);
        return transactions.stream()
                .map(TransactionMapper::toDTO)
                .toList();
    }

    @Override
    public TransactionDTO getTransactionById(Long id) {
        String token = extractTokenFromSecurityContext();
        Long customerId = jwtService.extractCustomerId(token);

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found."));

        if (!isCustomerInTransaction(transaction, customerId)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized: You are not part of this transaction.");
        }

        return TransactionMapper.toDTO(transaction);
    }

    private boolean isCustomerInTransaction(Transaction transaction, Long customerId){
        if (transaction.getAccount().getCustomer().getId().equals(customerId)){
            return true;
        }

        if (transaction.getTargetAccountId() != null) {
            return accountRepository.findById(transaction.getTargetAccountId())
                    .map(Account::getCustomer)
                    .map(customer -> customer.getId().equals(customerId))
                    .orElse(false);
        }

        return false;
    }

    private String extractTokenFromSecurityContext() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No request context available.");
        }

        HttpServletRequest request = attributes.getRequest();
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or missing Authorization header.");
        }

        return authHeader.substring(7);
    }
}
