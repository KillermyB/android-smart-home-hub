// Prepare a short-lived encrypted bundle. Input and code must remain outside Git.
import {readFileSync,writeFileSync} from 'node:fs';
import {randomBytes,createCipheriv} from 'node:crypto';
const [input,output,codePath]=process.argv.slice(2);if(!input||!output||!codePath)throw Error('Usage: node scripts/connection-pack.mjs private-config.json encrypted.json private-code.txt');
const value=JSON.parse(readFileSync(input,'utf8'));if(!Array.isArray(value.calendars)||value.calendars.length>30)throw Error('Invalid calendar bundle');
value.expires=Date.now()+30*60000;const key=randomBytes(32),iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);cipher.setAAD(Buffer.from('hub-connections-v1'));
const encrypted=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final(),cipher.getAuthTag()]);
writeFileSync(output,JSON.stringify({format:'hub-connections',version:1,iv:iv.toString('base64url'),data:encrypted.toString('base64url')}),{mode:0o600});
writeFileSync(codePath,key.toString('base64url'),{mode:0o600});console.log('Encrypted bundle prepared. Keep its code separate; delete both after association.');
