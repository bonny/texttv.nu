import React, { useEffect, useState } from "react";
import fitty from "fitty";
import "./texttv-page.css";
import { FontSubscriber } from "react-with-async-fonts";

export const TextTvPage = props => {
  const { pageNum } = props;
  const [fontIsLoaded, setFontIsLoaded] = useState(false);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `Title yo`;

    // https://github.com/rikschennink/fitty
    if (fontIsLoaded) {
      // console.log("run fitty because font is loaded", pageNum, fontIsLoaded);
      fitty(".TextTVPage__inner", {
        minSize: 2,
        maxSize: 18
      });

      setTimeout(() => {
        // console.log("fitty.fitAll()	");
        fitty.fitAll();
      }, 1500);
    }
  }, [pageNum, fontIsLoaded]);

  function createMarkup(fonts) {
    // console.log("createMarkup() fonts", fonts);

    return {
      __html: `<div class="root"><span class="toprow"> 100 SVT Text         Söndag 02 jun 2019
</span><span class="B bgB"> </span><span class="B bgB">                                      </span>
<span class="B bgB"> </span><span class="B bgB">                                      </span>
<span class="B bgB"> </span><span class="B bgB">                                      </span>
<span class="B bgB"> </span><span class="B bgB">                                      </span>
<span class="Y">                                       </span>
<span class="Y"> Om flyget ska betala miljökostnaderna:</span>
<h1 class="Y DH"> 8 <a href="/900">900</a> kronor i skatt på Thailandsresa </h1>
<span class="C">                 </span><span class="Y"> <a href="/111">111</a></span><span class="Y">                  </span>
<span class="W"> </span><span class="Y">                                      </span>
<span class="C">          Föräldrar höll sina          </span>
<span class="C">           fem barn isolerade          </span>
<span class="C">                  <a href="/108">108</a>                  </span>
<span class="Y"> </span><span class="Y">                                      </span>
<span class="Y"> Ovanligt många poliser uppsagda ifjol </span>
<h1 class="Y DH"> Rattfulla anställda fick behålla jobb </h1>
                <span class="Y"> <span class="Y"><a href="/106-107">106-107</a>                </span>
<span class="C">                                       </span>
<span class="Y"> </span><span class="C">Nytt utbrott i Etna på Sicilien - <a href="/134">134</a> </span>
                                        
<span class="added-line">                                       </span>
<span class="added-line">                                       </span>
<span class="added-line">                                       </span>
<span class="B bgB DH"> </span><span class="B bgB DH"> </span><h1 class="Y bgB DH"> Majvädret: Ungefär som förväntat <a href="/417">417</a></h1>
</span></div>`
    };
  }

  return (
    <FontSubscriber>
      {fonts => {
        // console.log("fonts", fonts);
        if (fonts.ubuntuMono) {
          setFontIsLoaded(true);
        }

        return (
          <div className="TextTVPage">
            <div className="TextTVPage__wrap">
              <div
                className="TextTVPage__inner"
                dangerouslySetInnerHTML={createMarkup(fonts)}
              />
            </div>
          </div>
        );
      }}
    </FontSubscriber>
  );
};
