# Push/Pull to Amazon ECR Action

Push an image to, or pull an image from Amazon's Elastic Container Registry.

See also [Login to Amazon ECR Action](https://github.com/jwalton/gh-ecr-login).

## setup

To set this up, create a new IAM user with access to ECR (e.g. with the
AmazonEC2ContainerRegistryFullAccess policy). Then, add the following secrets
to your GitHub project:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## inputs

- `access-key-id` - Your IAM user's AWS access key ID.
- `secret-access-key` - Your IAM user's AWS secret key.
- `image` - The image to upload. e.g. "myimage:v1.2.0".
- `region` - The ECR region to upload to. Defaults to 'us-east-1'.

## login

Push an image to ECR:

```yaml
- run: docker build --tag my-image:v1 .
- name: Push to ECR
  id: ecr
  uses: jwalton/gh-ecr-push@v1
  with:
    access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    region: us-east-1
    image: my-image:v1
```

Push the local image 'my-image' to ECR as 'my-image:dev-XXXXX':

```yaml
- run: docker build --tag my-image .
- name: Push to ECR
  id: ecr
  uses: jwalton/gh-ecr-push@v1
  with:
    access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    region: us-east-1
    local-image: my-image
    image: my-image:dev-${{ github.sha }}
```

Pull an image from ECR:

```yaml
- name: Pull from ECR
  id: ecr
  uses: jwalton/gh-ecr-push@v1
  with:
    access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    region: us-east-1
    image: my-image:dev-${{ github.sha }}
    local-image: my-image
    direction: pull
```
