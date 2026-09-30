package com.bankease.exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler{
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<String>handleEmailAlreadyExists(EmailAlreadyExistsException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Email Already Exists");
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String>handleArgumentNotValid(MethodArgumentNotValidException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Request Data");
    }
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<String>handleInvalidCredentials(InvalidCredentialsException exception){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Email or Password");
    }
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String>handleUserNotFound(UserNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Found");
    }
    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<String>handleAccountNotFound(AccountNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account Not Found");
    }
    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<String>handleInfusfficienBalance(InsufficientBalanceException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Insufficient Balance");
    }
    @ExceptionHandler(AccountBlockedException.class)
    public ResponseEntity<String>handleAcccountBlocked(AccountBlockedException exception){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account Is Blocked");
    }
    @ExceptionHandler(SameAccountTransferException.class)
    public ResponseEntity<String>handleSameAccount(SameAccountTransferException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Both Accounts Cannot Be Same");
    }
    @ExceptionHandler(TransactionNotFoundException.class)
    public ResponseEntity<String>handleNoTransaction(TransactionNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Transaction Not Found");
    }
    @ExceptionHandler(BillerNotFoundException.class)
    public ResponseEntity<String>handleBillerNotFound(BillerNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Biller Not Found");
    }
    @ExceptionHandler(BillerNotActiveException.class)
    public ResponseEntity<String>handleBillerNotActive(BillerNotActiveException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Biller Is Not Active");
    }
    @ExceptionHandler(BillPaymentNotFoundException.class)
    public ResponseEntity<String>handleBillPaymentNotFound(BillPaymentNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bill Payment Not Found");
    }
    @ExceptionHandler(LoanApplicationNotFoundException.class)
    public ResponseEntity<String>handleLoanApplicationNotFound(LoanApplicationNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Loan Application Not Found");
    }
    @ExceptionHandler(LoanAlreadyReviewedException.class)
    public ResponseEntity<String>handleLoanAlreadyReviewed(LoanAlreadyReviewedException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Loan Already Reviewed");
    }
    @ExceptionHandler(InvalidLoanDecisionException.class)
    public ResponseEntity<String>handleInvalidLoanDecision(InvalidLoanDecisionException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Loan Decision");
    }
    @ExceptionHandler(LoanNotFoundException.class)
    public ResponseEntity<String>handleLoanNotFound(LoanNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Loan Not Found");
    }
    @ExceptionHandler(InvalidLoanRepaymentException.class)
    public ResponseEntity<String>handleInvalidLoanRepayment(InvalidLoanRepaymentException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Loan Repayment");
    }
    @ExceptionHandler(LoanNotActiveException.class)
    public ResponseEntity<String>handleLoanNotActive(LoanNotActiveException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Loan Not Active");
    }
    @ExceptionHandler(AmountMissingException.class)
    public ResponseEntity<String>handleAmountMissing(AmountMissingException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Amount Is Missing");
    }
    @ExceptionHandler(ApplicationNotApprovedException.class)
    public ResponseEntity<String>handleApplicationNotApproved(ApplicationNotApprovedException exception){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Application Not Approved");
    }
    @ExceptionHandler(LoanAlreadyDisbursedException.class)
    public ResponseEntity<String>handleLoanAlreadyDisbursed(LoanAlreadyDisbursedException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Loan Already Disbursed");
    }
    @ExceptionHandler(java.lang.IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(
            java.lang.IllegalArgumentException exception) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(exception.getMessage());
    }
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalState(
            IllegalStateException exception) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(exception.getMessage());
    }
}
