function Home(){
    return(
        <main className="home">
            <section className="hero">
            <h1>AI-Powered Recruitment & Hiring</h1>
            <p>Find the right candidates using explainable AI-based
        job and candidate matching.</p>
        <button>Get Started</button>
        </section>
        <section className="roles">
            <div className="role-card">
            <h2>For Candidates</h2>
            <h3>Find Opportunities That Match Your Skills</h3>
            <p>Upload your resume and discover how well your skills and experience match available job opportunities. 
                Get clear insights into your strengths and skill gaps.</p>
                <button>Explore Jobs</button>
                </div>
        <div className="role-card">
            <h2>For Recruiters</h2>
            <h3>Find the Right Candidates Faster</h3>
            <p>Analyze job requirements, compare candidates based on relevant skills and experience, 
                and understand why a candidate matches your role.</p>
                <button>Post a Job</button>
                </div>
        </section>
        </main>
    );
}
export default Home;