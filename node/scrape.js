import axios from 'axios';
import { load } from 'cheerio';
import { writeFileSync } from 'fs';

async function fetchSortedNews() {
    try {
        const { data } = await axios.get('https://phys.org/sort/rank/1w/');
        
        // Load the HTML into Cheerio and grab specific class
        const $ = load(data);
        const sortedNewsHTML = $('.sorted-news-list').html();

        // Extract the content of the div container
        writeFileSync('data/output.html', sortedNewsHTML);

        console.log('Content extracted and saved to output.html');

    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

fetchSortedNews();
