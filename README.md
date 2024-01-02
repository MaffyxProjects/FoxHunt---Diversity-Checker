# FoxHunt---Diversity-Checker
AutoSourcing For Diversity Candidates on LinkedIn Recruiter

# LinkedIn Diversity Checker Chrome Extension

This Chrome extension automates the process of evaluating LinkedIn recruiter search results to determine whether a person might originate from the United States or could potentially be a female candidate. The extension runs names through two separate APIs from Nationalize.io or Genderize.io and provides a probability result, allowing users to save or ignore profiles for later review.

## Features

- **Diversity Check:** Scroll through LinkedIn search results, analyze names, and determine the probability of a female candidate.
- **Nationality Check:** Assess the likelihood that a person originates from the United States.
- **Save and Review:** Save positive results to the project for manual review.

## How to Use

1. **Install the Extension:**
   - Clone this repository to your local machine.
   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" and click "Load unpacked."
   - Select the extension directory.

2. **Run Diversity Checker:**
   - Open a LinkedIn recruiter search page.
   - Click on the extension icon in the toolbar.
   - Select "Run Diversity or Nationality Checker" to start the analysis.

3. **Review Results:**
   - Positive results will be saved to the project for later review.

## Configuration

Make sure to set your API keys for Genderize.io and Nationalize.io in the extension code.

## Disclaimer

This extension is intended for personal and educational use only. Use responsibly and in accordance with the terms of service of the websites and services accessed.
