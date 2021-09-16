import React from 'react';
import Gif from '../../assets/img/gif.gif';
const GetStarted = () => {
  return (
    <section className="section-get-started d-none d-md-block">
      <div className="container text-center">
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <img src={Gif}/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
