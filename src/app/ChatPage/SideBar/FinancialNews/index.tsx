import React, { useEffect, useState } from 'react';

type Article = {
    title: string;
    description: string;
    url: string;
}

const FinancialNews = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const apiKeyNews = process.env.NEXT_PUBLIC_NEWSAPI_API_KEY
                const response = await fetch(`https://newsapi.org/v2/top-headlines?category=business&country=in&apiKey=${apiKeyNews}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch news');
                }
                const data = await response.json();
                setArticles(data.articles);
            } catch (error) {
                console.error('Failed to fetch news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return <div>Loading news...</div>;

    return (
        <div className='h-[47.5vh] max-h-full scroll-container overflow-y-auto'>
            <div className=''>
                {/* {articles.map((article, index) => (
                    <div key={index} className="mb-4">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-semibold">
                            {article.title}
                        </a>
                        <p>{article.description}</p>
                    </div>
                ))} */}
                <div>
                    <p><strong>Name:</strong> Abhinav</p>
                    <p><strong>Account Number:</strong> XXXX</p>
                    <p><strong>Bank:</strong> Bank of Baroda</p>
                    <p><strong>IFSC Code:</strong> XXXX</p>
                    <p><strong>Bank Statement Period:</strong> 3 Months</p>
                </div>
            </div>
        </div>
    );
};

export default FinancialNews;
