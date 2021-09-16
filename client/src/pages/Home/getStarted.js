import React from 'react';
import Gif from '../../assets/img/gif.gif';
const GetStarted = () => {
  return (
    <section className="section-get-started d-none d-md-block">
      <div className="container text-center">
        <div className="row row-get-started">
          <img src={Gif}/>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
