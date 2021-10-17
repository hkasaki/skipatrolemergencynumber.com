
aws s3 sync site/ s3://skipatrolemergencynumber.com/
aws cloudfront create-invalidation --distribution-id E1DTWKFV979OO8 --paths "/*"
