import exec from 'child_process';

export default function PingServer() {
    setInterval(async () => {
        exec.exec(`ping ${process.env.SERVER_URL.split('//')[1]}` , (err, stdout, stderr)=>{
            console.log(stdout)
        })
    }, 840000);
}

