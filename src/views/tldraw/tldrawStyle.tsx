import { Helmet } from 'react-helmet';

const TldrawStyles = () => (
  <Helmet>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet" />
    <style>{`
              html,
              body {
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                font-family: Inter, sans-serif !important;
                font-size: 16px !important;
                overscroll-behavior: none !important;
                touch-action: none !important;
                min-height: 100vh !important;
                min-height: -webkit-fill-available !important; /* mobile viewport bug fix */
              }

              .tldraw__editor {
                position: fixed;
                inset: 0;
                overflow: hidden;
              }
 `}</style>
  </Helmet>
);

export default TldrawStyles;
