import React from "react";
import BgImgTextBannerAltStyle from "../../BgImgTextBannerAltStyle/BgImgTextBannerAltStyle";
import HeadlineTextGradientBg from "../../HeadlineTextGradientBg/HeadlineTextGradientBg";
import './HowToTaste.scss'  

class HowToTaste extends React.Component {
    render() {
        return (
            <section className='howtotaste pageWrapper'>
                <HeadlineTextGradientBg image={'how_to_taste.png'}>
                    <h1>How To Taste</h1>
                    <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                </HeadlineTextGradientBg>
                <BgImgTextBannerAltStyle dark={false} right={false} bgImage={'vodka-min.jpg'}>
                    <h2>1. Vodka voraus</h2>
                    <p>Der Vodka im Voraus soll die Zunge auf den Alkohol vorbereiten und für diesen unempfindlich machen, sodass Aromen besser erschmeckt werden können. Dafür den Vodka einige Zeit über der Zunge verteilen, bis es überall so stark brennt, dass man es kaum noch aushält, erst dann schlucken</p>
                </BgImgTextBannerAltStyle>
                <BgImgTextBannerAltStyle dark={true} right={true} bgImage={'nosing-min.jpg'}>
                    <h2>2. Das Nosing</h2>
                    <p>min. 2cl! Notiz: Wachholder ist immer da, lassen wir weg.<br></br>Das Glas etwas schwenken. Dabei beginnt man von einiger Entfernung und riecht sich in Richtung des Glases, dann führt man das Glas hin und her. So können immer weitere Aromen und Gerüche entdeckt werden.<br></br>Nicht die Nase ins Glas halten!</p>
                </BgImgTextBannerAltStyle>
                <BgImgTextBannerAltStyle dark={false} right={false} bgImage={'tasting-min.jpg'}>
                    <h2>3. Das Tasting</h2>
                    <p>kleine, aber ausreichende Schlucke, erst etwas auf der Zunge bewegen, über die Zunge fließen lassen. Der erste Eindruck beschreibt die Aromen, die hervorkommen, wenn der Gin das erste Mal die Zunge berührt. „Floral?“, „Zitrusaromen?“, „Welche Rolle spielt der Wacholder?“, „finden wir ungewöhnliche Aromen?“ sind Fragen, an denen man sich orientieren kann. Ist der Gin „weich“ auf der Zunge? Schärfe im Abgang? Häufig bleiben Aromen erst nach dem Schlucken auf der Zunge oder im Gaumen zurück. Man erkennt oft noch einmal andere Aromen als in der Nase. Wichtig ist es, mehrfach zu probieren. Auch ein geübter Gaumen erkennt die Aromen oft nur nacheinander.</p>
                </BgImgTextBannerAltStyle>
                <BgImgTextBannerAltStyle dark={true} right={true} bgImage={'tonic-min.jpg'}>
                    <h2>4. Das Tonic</h2>
                    <p>Der Gin wird pur probiert, denn nur so lassen sich die einzelnen Aromen erschmecken. Es bietet sich jedoch an, den Gin auch als Gin Tonic zu kosten, so kommen die Aromen häufig nochmal anders zur Geltung. Die Tonic Auswahl ist Geschmacksache. Wer einen ausgewogenen G&T mag, sollte darauf achten, dass sich Gin und Tonic ergänzen und nicht überlagern: süßer Gin+trockener Tonic und anders herum. Hintergrundaromen können durch ein passendes Tonic hervorgehoben werden. Ein Indian Tonic passt aber eigentlich fast immer unserer Ansicht nach. Wenn man es nicht so bitter mag, sollte man keinen Dry Tonic nehmen, auch wenn das häufig empfohlen wird.</p>
                </BgImgTextBannerAltStyle><BgImgTextBannerAltStyle dark={false} right={false} bgImage={'garnish-min.jpg'}>
                    <h2>5. Die Garnitur</h2>
                    <p>mit dem Garnisch kann man den Geschmack am Ende auch nochmal gut lenken und Aromen des Gins ergänzen oder stärken. Zu Frucht kann dann z.B. durchaus auch ein Gewürz passen, z.B. Minze oder Basilikum. Würzigen Gins kann eine Zitrone guttun damit es etwas frischer wird. Man kann aber auch ein Botanical des Gins betonen, das einem beim Tasting evtl. etwas zu kurz kam. Ein Garnish passend zur Hauptnote ist auch nicht falsch, v.a. in einem dry Gin.</p>
                </BgImgTextBannerAltStyle>
            </section>
        );
    }
}

export default HowToTaste;