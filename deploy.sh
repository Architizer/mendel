#! /bin/bash
# deploy.sh

SHA1=$1
EB_ENVIRONMENT=$2

SHA_CUT=`echo $SHA1 | cut -c1-5`

EB_BUCKET=architizer-mendel-deployment
EB_APPLICATION=architizer-mendel
NOW=`date '+%F-T-%H-%M-%S'`
SOURCE_BUNDLE=Source-$NOW-$SHA_CUT.zip

# Configure AWS CLI
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set default.region us-east-1
aws configure set default.output json

# Create Source Bundle Zip
zip $CIRCLE_ARTIFACTS/$SOURCE_BUNDLE -r *

# Create new Elastic Beanstalk version
aws s3 cp $CIRCLE_ARTIFACTS/$SOURCE_BUNDLE s3://$EB_BUCKET/$SOURCE_BUNDLE
aws elasticbeanstalk create-application-version --application-name $EB_APPLICATION \
  --version-label $NOW-$SHA_CUT --source-bundle S3Bucket=$EB_BUCKET,S3Key=$SOURCE_BUNDLE

# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment --environment-name $EB_ENVIRONMENT \
  --version-label $NOW-$SHA_CUT