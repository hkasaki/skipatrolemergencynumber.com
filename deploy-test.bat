
aws s3 sync site/ s3://test.skipatrolemergencynumber.com/
aws cloudfront create-invalidation --distribution-id E3DQ3WGASIK1X7 --paths "/*"
