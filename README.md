Moved to gitlab https://gitlab.com/thebigwasp/LeetcodeRuntimes

# LeetcodeRuntimes
Scrape your [Leetcode](https://leetcode.com/) submissions and see how fast your solutions are.
***
![submissions](https://github.com/thebigwasp/LeetcodeRuntimes/assets/17221930/d0a78100-e27d-46c0-92a2-74988f5dbb9e)
***
```Actualize``` button starts leetcode scraping, which may take a long time in case of lots of submissions. If progress meter stopped, this probably means we hit leetcode throttle limit. Processing will continue after a pause.

## How to install
Export your leetcode cookies from browser in netscape format to a file called ```cookies.txt``` in the root of project directory.
Cookies can be exported via browser extension (example [Export Cookies](https://addons.mozilla.org/en-US/firefox/addon/export-cookies-txt/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search), this particular case requires to rename file after export).

#### Deploy
* Docker
```
docker build -t leetcoderuntimes .
docker run -d -p 1337:1337 -v $(pwd):/opt/LeetcodeRuntimes leetcoderuntimes
```
* Bare metal
```
pip install -r requirements.txt
python run.py
```
Visit [localhost:1337](http://localhost:1337)
