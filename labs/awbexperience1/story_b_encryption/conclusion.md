<page title="Conclusion"/>

CONCLUSION
====

You've now learned how to improve the security of our application by encrypting sensitive data and hiding it from the view of everyone (even the database engine itself!). It will be responsability of the driver used by the client application that requires access to the data (in this scenario the payroll system) to be configured in order to support Always Encrypted. Sadly, the Tedious driver that is used by MyExpenses doesn't support Always Encrypted yet.