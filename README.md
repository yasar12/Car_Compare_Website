# Car_Compare_Website

We used a 3-tier architecture in the project. The presentation layer is provided by our user interface, the business logic layer is provided by route classes and the data layer is provided by combining repository classes with postgreSQL.

In total, 4 basic and 3 other design patterns were used in the project. These are; Singleton, Observer, Proxy, Strategy, Route, Repository, Configuration design patterns.

There is a class called database in our config file, database is defined once in this class and then this database is used in the whole project. Since it is defined once, there is a Singleton design pattern here. In the same way, changes in the database etc. can be made on this class, which supports the configuration design pattern.

route design pattern is used with userRoute and adminRoute classes. repository design pattern is used with userRepository and adminRepository.

In the proxy file, proxy design pattern was used with RouteProx class. In the logger file, observer design pattern was used in the UserLoggin class. In this class, comparison operations and number of visits are logged.

Our strategy design pattern is used in our py file in data. In this py file, there is a code that we get the data from the relevant site by scraping the data and saving the relevant information to the database.


you can start the whole project from index.js

nodejs index.js

