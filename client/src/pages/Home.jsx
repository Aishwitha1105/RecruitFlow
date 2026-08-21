import { Link } from "react-router-dom";

function Home() {
    return (
        <main className="home-page">

            <section className="hero">
                <div className="hero-content">
                    <span className="hero-badge">
                        AI-powered hiring platform
                    </span>

                    <h1>
                        Find the right job.
                        <br />
                        Hire the right talent.
                    </h1>

                    <p>
                        RecruitFlow connects candidates with opportunities
                        and helps recruiters discover qualified talent faster.
                    </p>

                    <div className="hero-actions">
                        <Link
                            to="/register"
                            className="primary-btn"
                        >
                            Find Jobs
                        </Link>

                        <Link
                            to="/recruiter/register"
                            className="secondary-btn"
                        >
                            Hire Talent
                        </Link>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="section-heading">
                    <span>WHY RECRUITFLOW</span>

                    <h2>
                        Everything you need to make hiring easier.
                    </h2>
                </div>

                <div className="features-grid">

                    <div className="feature-card">
                        <div className="feature-icon">
                            🔎
                        </div>

                        <h3>
                            Smart Job Discovery
                        </h3>

                        <p>
                            Search opportunities based on your skills,
                            experience and career interests.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            ⚡
                        </div>

                        <h3>
                            Faster Hiring
                        </h3>

                        <p>
                            Recruiters can create jobs and manage
                            candidates from one simple dashboard.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            🎯
                        </div>

                        <h3>
                            Better Matches
                        </h3>

                        <p>
                            Connect candidates with opportunities that
                            align with their skills and experience.
                        </p>
                    </div>

                </div>
            </section>

            <section className="cta-section">

                <h2>
                    Ready to take the next step?
                </h2>

                <p>
                    Create your RecruitFlow account and get started.
                </p>

                <Link
                    to="/register"
                    className="primary-btn"
                >
                    Get Started
                </Link>

            </section>

        </main>
    );
}

export default Home;