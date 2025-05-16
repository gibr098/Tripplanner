# Tripplanner

## Progetto del corso di Reti di calcolatori

Triplanner è un servizio che permette di programmare un viaggio verso una città o una località delle quali vengono fornite informazioni e luoghi  di interesse.
La programmazione di viaggi avviene mediante l'integrazione con Google Calendar, al quale il server accede grazie ad Oauth.
Il servizio fornisce inoltre un servizio di cronologia, tenendo in memoria le ricerche recenti

SERVIZI UTILIZZATI:
1- Google Places da infomazioni sul posto in cui si vuole andare
2- Google Maps per visualizzare la mappa della citta scelta
3- Google Calendar (OAUTH) permette di salvare sul calendario il viaggio con città di destinazione, tipo e nome del luogo da visitare, la data di partenza e di ritorno
4- AMQP per la gestione della cronologia.
5- Database postgres per salvare le ricerche dell'utente

Come Funziona:
Una volta avviato server.js, si verrà reindirizzati direttamente sulla pagina iniziale dell'applicazione dalla quale è possibile accedere all' applicazione vera e propria cliccando su '/start', oppure alla documentazione raggiungibile mediante /api-docs.
Una volta giunti alla home sarà possibile scegliere di cercare specifici punti di interesse in una determina città, gestire i viaggi mediante l'integrazione con google calendar, e accedere alla cronologia delle ricerche,
Per quanto riguarda la ricerca dei punti di interesse, dopo aver inserito la citta scelta come meta e il tipo di luogo a cui si è interessati, premendo cerca verranno visualizzati i nomi dei luoghi di interesse con la rispettiva via e una mappa della citta; 
Nella sezione 'Programma con calendar' è possibile programmare il proprio viaggio su calendar: dopo aver fatto il login con Google si avrà la possibilità di pragrammare il proprio viaggio aggiungendo un evento al calendario con la data di partenza e quella di ritorno, la citta e il luogo di interesse; inoltre cliccando su 'Mostra eventi programmati' è possibile viusualizzare tutti gli eventi creati dall'utente; è inoltre possibile cancellare un evento programmato fornendo in input l' eventID associato all'evento.
La funzione di cronologia invece permette all'utente di rivedere tutte le ricerche che ha compiuto e eventualmente di cancellarle.


Requisiti necessari:
- Per la corretta esecuzione del server è necessario installare tutte le dipendenze, che si possono trovare in dependencies.txt

