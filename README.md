# Summary
TL;DR: OTTopsy is like BuiltWith.com, but dissect a website's OTT components through a Chrome extension.

browser-ott-dissection is a Chrome extension. If you click the extension, and press the 'analyze' button,
the extension dissects the current (OTT) web page and presents:
- The video player,
- Whether HLS/DASH is used,
- The analytics system,
- And much more.

# Installation
1. Open Chrome.
2. Go to chrome://extensions through your address bar.
3. Enable "Developer Mode".
4. Click 'Load unpacked'.
5. Navigate to the root folder of this repository.
6. Confirm that the extension is toggled on.

# Usage
1. Go to a website which uses video.
2. Click the extension button. A panel appears with an "Analyze OTT tools" button, and an error message.
3. Click the "Analyze OTT tools" button.

# FAQ
How does it work?
- The extension compares all network request URLs with a set of patterns.

It doesn't work -- what do I do?
- Try to re-install it. E-mail lowette@gmail.com if that doesn't help.

What are the next five feature improvements?
- Only track requests on a page where the extension button has been explicitly clicked.
- Assign components of an <iframe> to the parent page.
- Identify a analytics system through it's periodical ping.
- Dissect HLS and DASH manifest.
- Extract version number of components.
 