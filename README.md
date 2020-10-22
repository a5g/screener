# screener

Test automation project to grab the stocks data from screener.in

### Prerequisites

- Nodejs 8.x [Install Nodejs 8.x or later version using [nvm](https://github.com/creationix/nvm) or [Node.js](https://nodejs.org/en/)]
- [Java 1.8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) (optional - required for allure report generation)

### Setup Automation

\> git clone git@github.com:a5g/screener.git <br />
\> cd screener <br />
\> npm install <br/>
\> npm install -g gulp-cli jest-cli allure-commandline <br/><br/>
Enter the required credentials in input.ts <br/><br/>

### Get stocks data from good companies

\> gulp profit

### Get stocks data from all companies

\> gulp all

### Test Reports

\> gulp report
