FROM ubuntu:disco

ENV NODE_VERSION 10

RUN set -x && \
  apt-get update && \
  apt-get install -y \
    ca-certificates \
    curl \
    git \
    python3-pip \
  && \
  : "to fix vulnerabilities, update packages : 2019-11-19" && \
  : apt-get install -y --no-install-recommends \
    e2fsprogs \
  && \
  : "install awscli" && \
  pip3 install awscli && \
  : "install node" && \
  curl -sL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash - && \
  apt-get install -y nodejs && \
  npm install -g npm && \
  rm -rf /root/.npm && \
  : "cleanup apt caches" && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  : "add working user" && \
  useradd -m getto && \
  : "environment prepared"

USER getto

CMD ["/bin/bash"]
