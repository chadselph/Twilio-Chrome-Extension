This is my Chrome extension for playing with the Twilio API.
I was unhappy with the existing extensions, as they went through an AppEngine app instead of directly hiting Twilio with XMLHttpRequest.
This is a pretty early proof of concept and I'm quick to admit that I suck at Javascript, so the code isn't great yet.

TODO:

* Only supports a few API methods (create call, create SMS), add a lot more
    * When there's enough methods, split the menu into resource and action menus
* Add links to documentation
* Add some CSS that doesn't totally suck / UI overhaul
* Chrome extension zip file for easier install
* Render JSON/XML responses nicer than just plain text in a <textarea />

How to install
==============
Follow these instructions: http://code.google.com/chrome/extensions/getstarted.html#load except replace step 1-3 with a git clone.
