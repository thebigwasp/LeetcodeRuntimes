FROM python:3.9.2

COPY . /opt/LeetcodeRuntimes
WORKDIR /opt/LeetcodeRuntimes
RUN pip install -r requirements.txt
VOLUME /opt/LeetcodeRuntimes

CMD python run.py
