import chalk from 'chalk';

class Logger {
    static info(content: string) {
        console.log(chalk.green(content));
    }
    
    static warn(content: string) {
        console.log(chalk.yellow(content));
    }

    static error(content: string) {
        console.log(chalk.red(content));
    }
}

export default Logger;