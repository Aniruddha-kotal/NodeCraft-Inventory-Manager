

echo "$EC2_SSH_KEY_CONTENT" > ec2-private-key.pem
chmod 600 ec2-private-key.pem

rsync -avz --exclude 'node_modules' -e "ssh -i ec2-private-key.pem" ./ ec2-user@3.145.3.17:/home/ec2-user/NodeProject/node
ssh -i ec2-private-key.pem ec2-user@3.145.3.17 'cd /home/ec2-user/NodeProject/node && npm install && pm2 restart server.js'
