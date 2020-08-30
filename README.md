PROGETTO RETI DI CALCOLATORI
Servizio che permette di programmare un viaggio verso una città o una località delle quali vengono fornite informazioni e luoghi  di interesse 

SERVIZI UTILIZZATI:
1- Google Places da infomazioni sul posto in cui si vuole andare
2- Google Maps per visualizzare la mappa della citta scelta
3- Google Calendar (OAUTH) permette di salvare sul calendario il viaggio con la data di partenza e di ritorno

4- AMQP per la gestione della cronologia



Come Funziona:
Una volta avviato server.js, si verrà reindirizzati direttamente sulla pagina iniziale dell'applicazione dove cliccando su '/start' si avrà accesso alla form (form.html) dove, dopo aver inserito la citta scelta come meta e il tipo di luogo a cui si è interessati, premendo cerca verranno visualizzati i nomi dei luoghi di interesse con la rispettiva via e una mappa della citta; tramite il bottone 'Programma' è possibile programmare il proprio viaggio su calendar: dopo aver fatto il login con Google si avrà la possibilità di pragrammare il proprio viaggio aggiungendo un evento al calendario con la data di partenza e quella di ritorno, la citta e il luogo di interesse; inoltre cliccando su 'Mostra eventi programmati' è possibile viusualizzare tutti gli eventi creati dall'utente. La funzione di cronologia invece permette all'utente di rivedere tutte le ricerche che ha compiuto e eventualmente di cancellarle.