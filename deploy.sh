#! /bin/bash

set -x
set -e


wget https://s3.amazonaws.com/elasticbeanstalk/cli/AWS-ElasticBeanstalk-CLI-2.6.3.zip -O /home/ubuntu/AWS-ElasticBeanstalk-CLI-2.6.3.zip
cd /home/ubuntu && unzip AWS-ElasticBeanstalk-CLI-2.6.3.zip
echo 'export PATH=$PATH:/home/ubuntu/AWS-ElasticBeanstalk-CLI-2.6.3/eb/linux/python2.7/' >> ~/.circlerc

cd /home/ubuntu/$CIRCLE_PROJECT_REPONAME && bash /home/ubuntu/AWS-ElasticBeanstalk-CLI-2.6.3/AWSDevTools/Linux/AWSDevTools-RepositorySetup.sh

# set up credentials

touch /home/ubuntu/.aws-credentials
chmod 600 /home/ubuntu/.aws-credentials
echo "AWSAccessKeyId=$AWS_ACCESS_KEY_ID" > /home/ubuntu/.aws-credentials
echo "AWSSecretKey=$AWS_SECRET_KEY" >> /home/ubuntu/.aws-credentials
echo 'export AWS_CREDENTIAL_FILE=/home/ubuntu/.aws-credentials' >> ~/.circlerc