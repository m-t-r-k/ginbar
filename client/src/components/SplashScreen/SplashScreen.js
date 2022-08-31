import React from 'react';
import './SplashScreen.scss';

class SplashScreen extends React.Component {
  render() {
    return(
      <section id="splashscreen" className={this.props.loaded ? "fade_out" : ""}>
        <div className="wrapper">
          <div className="loader_wrapper">
              <svg id="G" width="58" height="100px" viewBox="0 0 84 147">
                  <g id="Symbols" stroke="#ffffff" strokeWidth="1">
                      <g id="Artboard" transform="translate(-35.000000, -210.000000)" fill="#000000" fillRule="nonzero">
                          <path d="M97.7445255,354.955494 L96.5182482,353.319889 L96.0438858,353.531912 C95.3609403,353.814608 94.2246633,354.220983 92.6350365,354.751043 C90.5912307,355.432549 88.3771409,355.977745 85.9927007,356.386648 C83.6082606,356.795551 80.9854015,357 78.1240876,357 C70.4938791,357 63.4087918,355.56886 56.8686131,352.706537 C50.3284672,349.844214 45.0486819,345.346345 41.0291971,339.212796 C37.0097123,333.079246 35,325.446499 35,316.314325 L35,252.116829 C35,242.575752 36.5328314,234.90893 39.5985401,229.116134 C42.6642489,223.323337 47.0583655,218.655094 52.7810219,215.111266 C58.7761857,211.703755 66.1337764,210 74.8540146,210 C85.481805,210 95.0875483,212.248934 103.671533,216.746871 L96.9270073,236.987483 C93.2481568,235.624472 90.0462423,234.670378 87.3211679,234.125174 C84.5960934,233.579969 81.5985565,233.307371 78.3284672,233.307371 C71.7882885,233.307371 66.6788505,234.499988 63,236.885257 C59.3211495,239.270527 57.4817518,243.734321 57.4817518,250.276773 L57.4817518,316.723227 C57.4817518,323.265679 59.2189607,327.831698 62.6934307,330.421419 C66.1679006,333.01114 71.2432756,334.305981 77.919708,334.305981 C83.0973495,334.305981 87.4914661,333.045214 91.1021898,330.523644 C94.7129134,328.002074 96.5182482,323.47013 96.5182482,316.927677 L96.5182482,315.087622 L84.8686131,315.087622 L77.7153285,293.620306 L119,293.620306 L119,354.955494 L97.7445255,354.955494 Z" id="G_LETTER"></path>
                      </g>
                  </g>
              </svg>

              <svg id="IN" width="118px" height="100px" viewBox="0 0 168 143">
                  <g id="Symbols" stroke="#ffffff" strokeWidth="1">
                      <g id="Artboard" transform="translate(-144.000000, -212.000000)" fill="#000000" fillRule="nonzero">
                          <path d="M179,212 L179,355 L156.616279,355 L156.616279,234.062857 L144,233.654286 L144,212 L179,212 Z M233.581301,212 L289.213415,308.014286 L289.213415,212 L312,212 L312,355 L289.213415,355 L233.581301,258.372857 L233.581301,355 L211,355 L211,212 L233.581301,212 Z" id="IN_LETTERS"></path>
                      </g>
                  </g>
              </svg>

              <svg id="P" width="63px" height="100px" viewBox="0 0 89 143">
                  <g id="Symbols" stroke="#646464" strokeWidth="1">
                      <g id="Artboard" transform="translate(-344.000000, -212.000000)" fill="#000000" fillRule="nonzero">
                          <path d="M390.75576,212 C405.110671,212 415.739981,216.596383 422.644009,225.789286 C429.548038,234.982189 433,246.524216 433,260.415714 C433,296.914944 419.533929,315.164286 392.601382,315.164286 L366.557604,315.164286 L366.557604,355 L344,355 L344,212 L390.75576,212 Z M385.504673,235 L367,235 L367,294 L386.327103,294 C394.140226,294 399.86291,292.304615 403.495327,288.913793 C407.127744,285.522972 409.286601,281.691401 409.971963,277.418966 C410.657324,273.14653 411,267.755205 411,261.244828 C411,254.056286 410.00624,248.52933 408.018692,244.663793 C406.031143,240.798257 403.221202,238.221271 399.588785,236.932759 C395.956368,235.644246 391.261711,235 385.504673,235 Z" id="P_LETTER"></path>
                      </g>
                  </g>
              </svg>

              <svg id="ERIUM" width="345px" height="100px" viewBox="0 0 500 145">
                  <g id="Symbols" stroke="#646464" strokeWidth="1">
                      <g id="Artboard" transform="translate(-457.000000, -211.000000)" fill="#000000" fillRule="nonzero">
                          <path d="M752.470309,211 L752.470309,307.461864 C752.470309,316.74628 753.866178,323.470554 756.657957,327.634887 C759.449737,331.79922 764.862984,333.881356 772.897862,333.881356 C781.068924,333.881356 786.550263,331.79922 789.342043,327.634887 C792.133822,323.470554 793.529691,316.74628 793.529691,307.461864 L793.529691,211 L816,211 L816,316.473164 C816,330.263252 811.812393,340.298462 803.437055,346.579096 C795.225938,352.73658 785.346041,355.875645 773.797078,355.996378 L773.102138,356 L773.102138,356 C761.254098,356 751.108514,352.85973 742.665083,346.579096 C734.221652,340.298462 730,330.263252 730,316.473164 L730,211 L752.470309,211 Z M526,212 L526,234.471429 L479.724551,234.471429 L479.724551,270.63 L508.026946,270.63 L501.622754,292.08 L479.724551,292.08 L479.724551,334.571429 L525.586826,334.571429 L525.586826,355 L457,355 L457,212 L526,212 Z M600.489655,212 C609.491999,212 616.99384,214.213073 622.995402,218.639286 C628.996965,223.065498 633.46397,228.955678 636.396552,236.31 C639.329133,243.664322 640.795402,251.767575 640.795402,260.62 C640.795402,267.293367 640.522608,273.081404 639.977011,277.984286 C639.431415,282.887167 638.033345,287.994259 635.782759,293.305714 C633.532173,298.617169 629.951749,303.383788 625.041379,307.605714 L641,355 L618.085057,355 L604.377011,315.164286 L574.505747,315.164286 L574.505747,355 L552,355 L552,212 L600.489655,212 Z M699,212 L699,355 L676.616279,355 L676.616279,234.062857 L664,233.654286 L664,212 L699,212 Z M870.369403,212 L902.296642,306.584286 L934.630597,212 L957,212 L957,355 L934.630597,355 L934.630597,279.414286 L910.837687,355 L893.755597,355 L870.369403,279.618571 L870.369403,355 L848,355 L848,212 L870.369403,212 Z M591.745192,235 L575,235 L575,294 L595.879808,294 C602.633047,294 607.62899,292.264723 610.867788,288.794118 C614.106587,285.323512 616.104964,281.342583 616.862981,276.851211 C617.620997,272.359839 618,267.051934 618,260.927336 C618,253.71392 616.966356,248.23589 614.899038,244.49308 C612.83172,240.75027 609.937519,238.232417 606.216346,236.939446 C602.495174,235.646476 597.671504,235 591.745192,235 Z" id="ERIUM_LETTERS"></path>
                      </g>
                  </g>
              </svg>
          </div>
        </div>
      </section>
    )
  }
}

export default SplashScreen;
