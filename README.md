# Summary
TL;DR: OTTopsy is like BuiltWith.com, but dissect a website's OTT components through a Chrome extension.

![alt text](preview.png "Preview of OTTopsy")

OTTopsy is a Chrome extension. If you click the extension, and press the 'analyze' button,
the extension dissects the current (OTT) web page and presents:
- The video player,
- Whether HLS/DASH is used,
- The analytics system,
- And much more.

# Installation
1. Open Chrome.
2. Go to chrome://extensions through your address bar.
3. Enable "Developer Mode".
4. Click "Load unpacked".
5. Navigate to the `extension/` folder of this repository.
6. Confirm that the extension is toggled on.

# Usage
1. Go to a website which uses video. (Let the video play for a bit.)
2. Click the extension button. (It's a round purple smiley/ball.)
3. Check which products were detected.

# FAQ
How does it work?
- The extension compares all network request URLs with a set of patterns.

It doesn't work -- what do I do?
- Try to re-install it. E-mail lowette@gmail.com if that doesn't help.

What are the next feature improvements?
- Show a useful message instead of an error if no product matches are found.
- Rename patterns.json to products.json, and create a flatter structure instead of a nested structure.
- Build /extension/page_action/ files through webpack.
- Make the extension more generic and not specific to OTT.
Create a template for products.json, and use OTT as an example.
- Rebrand the app from OTTopsy to product-watcher.
 
 Is there a video illustrating the installation and usage of OTTopsy?
 * Yep! Check out [installation_and_usage_of_ottopsy.mp4](installation_and_usage_of_ottopsy.mp4).