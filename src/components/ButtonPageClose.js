import React from 'react';

const ButtonPageClose = () => {
  return (
    <section className="mbr-section content5 mbr-parallax-background">
      <div className="mbr-overlay overlay-40"></div>
      <nav className="navbar fixed-bottom justify-content-center d-flex row mx-auto position-fixed container main px-0">
        <div className="w-100 d-flex justify-content-center page-return-btn">
          <a href="main.html" className="close bg-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
              <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z"></path>
            </svg>
          </a>
        </div>
      </nav>
    </section>
  );
}

export default ButtonPageClose;