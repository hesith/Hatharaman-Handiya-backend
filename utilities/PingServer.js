import axios from 'axios';


export default function PingServer() {
    const serverURL = process.env.SERVER_URL; 
 
    setInterval(async () => {
        try{
            console.log(`Pinging the server ${serverURL} at`, new Date().toLocaleString());
            await axios.get(serverURL);
        }
        catch(e){ 
            console.log(`Server ${serverURL} is probably down at`, new Date().toLocaleString());     
        }
         
    }, 840000);
}

