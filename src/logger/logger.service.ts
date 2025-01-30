import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class LoggerService extends ConsoleLogger {
    private fileStream: fs.WriteStream;
    private readonly logDir = 'logs';
    private readonly maxFileSize = 1024 * 1024 * 10;
    private currentFileSize = 0;
    private currentDate: string;


    constructor(readonly context?: string) {
        super(context);
        this.createLogDirectory();
        this.currentDate = this.getCurrentDate();
        this.fileStream = this.createWriteStream();

    }

    log(message: any, context?: string) {
        super.log(message, context);
        this.writeLogToFile('LOG', message, context);
    }

    error(message: any, trace?: string, context?: string) {
        super.error(message, trace, context);
        this.writeLogToFile('ERROR', message, context, trace);
    }

    warn(message: any, context?: string) {
        super.warn(message, context);
        this.writeLogToFile('WARN', message, context);
    }

    debug(message: any, context?: string) {
        super.debug(message, context);
        this.writeLogToFile('DEBUG', message, context);
    }

    verbose(message: any, context?: string) {
        super.verbose(message, context);
        this.writeLogToFile('VERBOSE', message, context);
    }



    private createLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
    }

    private getCurrentDate(): string {
        return new Date().toISOString().slice(0, 10);
    }

    private createWriteStream(): fs.WriteStream {
        const filename = `${this.logDir}/mylog-${this.currentDate}.log`;
        return fs.createWriteStream(filename, { flags: 'a' });
    }

    private rotateLogs() {
        const newDate = this.getCurrentDate();
        if (newDate !== this.currentDate) {
            this.currentDate = newDate;
            this.fileStream.close();
            this.fileStream = this.createWriteStream();
            this.deleteOldLogFiles(); // Supprimer les anciens fichiers après la rotation
        }
    }

    private deleteOldLogFiles() {
        const files = fs.readdirSync(this.logDir);
        const now = new Date();

        files.forEach(file => {
            const filePath = `${this.logDir}/${file}`;
            const fileStats = fs.statSync(filePath);
            const fileAge = now.getTime() - fileStats.mtime.getTime();

            // Supprimer les fichiers de plus de 7 jours
            if (fileAge > 7 * 24 * 60 * 60 * 1000) {
                fs.unlinkSync(filePath);
            }
        });
    }

    private writeLogToFile(level: string, message: any, context?: string, trace?: string) {
        const logMessage = `
      Time: ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}
      Level: ${level}
      Context: ${context ? `[${context}] ` : ''}
      Message: ${message} 
      ${trace ? `\nTrace: ${trace}` : ''}
    `;
        this.fileStream.write(logMessage + '\n');  // Vérifier la taille du fichier avant d'écrire
        const messageSize = Buffer.byteLength(logMessage, 'utf8');
        if (this.currentFileSize + messageSize > this.maxFileSize) {
            this.rotateLogs(); // Rotation si la taille maximale est dépassée
        }

        this.fileStream.write(logMessage + '\n');
        this.currentFileSize += messageSize;
    }


    /// peu etre plu tard si on prefere json pour une analyse externe 
    private writeLogToFileJson(level: string, message: any, context?: string, trace?: string) {
        const logMessage = JSON.stringify({
            timestamp: new Date().toISOString(),
            level: level,
            context: context,
            message: message,
            trace: trace
        });
        this.fileStream.write(logMessage + '\n');
        const messageSize = Buffer.byteLength(logMessage, 'utf8');
        if (this.currentFileSize + messageSize > this.maxFileSize) {
            this.rotateLogs();
        }
        this.fileStream.write(logMessage + '\n');
        this.currentFileSize += messageSize;
    }
}