FROM ubuntu:22.10

RUN apt update \
    && apt-get install -y --no-install-recommends software-properties-common gpg-agent \
    && add-apt-repository ppa:libreoffice/ppa \
    && apt-get update \
    && apt install -y --no-install-recommends \
        libreoffice \
        python3-pip \
        nodejs \
        yarnpkg \
        supervisor \
    && add-apt-repository multiverse \
    && echo ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true | debconf-set-selections \
    && apt install ttf-mscorefonts-installer -y \
    && apt-get update -y \
    && apt-get install -y fonts-dejavu-core fonts-dejavu-extra \
    && fc-cache -f -v \
    && pip install --compile --no-cache-dir unoserver \
    && apt clean && rm -rf /var/lib/apt/lists/*

COPY . /src
COPY ./supervisord.conf /etc/supervisor/conf.d/

WORKDIR "/src"

RUN yarnpkg install --prod

EXPOSE 6789

CMD ["supervisord"]
