import React from 'react';
import spaceBack from '../../assets/img/spaceback.jpg';
import { OpenseaUrl, CollectionName, CollectionAddress } from '../../constants';
const Landing = () => {
  return (
    <>
    <section
      className="intro-hero"
      style={{background: `url(${spaceBack}) no-repeat top/cover`}}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-5 mx-auto text-center">
            <h4
              className="intro-hero__subtitle"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Find, Collect & Create
            </h4>
            <h1
              className="intro-hero__title"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Explore the our collection on opensea.
            </h1>
            <a
              href={`${OpenseaUrl}/collection/${CollectionAddress}`}
              className="btn btn-primary-outline btn-min-width"
              data-aos="fade-up"
              data-aos-delay="600"
              target="_blink"
            >
              EXPLORE
            </a>
          </div>
        </div>
        
      </div>
    </section>
    <section>
     <div className="container" style={{ marginTop: '20px' }}>
        <div className="row">
          <div className="col-lg-5 mx-auto text-center">
            <h1
              className="intro-hero__subtitle"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              About Us
            </h1>
            <p>
              Teenage Superhero is created by PRESTIGE LAB,
              it is company first collection, minting are almost free and mint as a gift for the community, Owning one will be consider like owning a VIP membershipe in the upcoming Prestige protocol
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Landing;
