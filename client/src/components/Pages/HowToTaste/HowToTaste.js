import React from "react";
import MotionWrapper from "../../MotionWrapper";
import BgImgTextBannerAltStyle from "../../BgImgTextBannerAltStyle/BgImgTextBannerAltStyle";
import HeadlineTextGradientBg from "../../HeadlineTextGradientBg/HeadlineTextGradientBg";
import './HowToTaste.scss'  

class HowToTaste extends React.Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <MotionWrapper>
                <section className='howtotaste pageWrapper'>
                    <HeadlineTextGradientBg image={'how_to_taste.png'}>
                        <h1>Die Verkostung</h1>
                        <p>Bei der Verkostung eines Gins, geht es unserer Meinung nach um weit mehr als nur um den Geschmack. Bereits die Farbe des Gins kann einem beispielsweise einiges verraten. Im folgenden, wollen wir euch kurz vorstellen, wie ihr ein Destillat richtig verkostet und worauf es dabei ankommt. Wer sich für den Gin in seiner natürlichen Form interessiert, kann die letzten Schritte überspringen, bei denen es um die Verkostung mit Tonic und die perfekte Garnitur geht.</p>
                    </HeadlineTextGradientBg>
                    <BgImgTextBannerAltStyle dark={false} right={false} bgImage={'glass-min.jpg'}>
                        <h2>1. Das richtige Glas</h2>
                        <p>Natürlich kann jedes Glas für ein Tasting herhalten. Es lohnt sich dennoch ein richtiges Nosing-Glas zu verwenden. Diese speziellen Gläser zur Verkostung von Spirituosen haben typischerweise eine bauchige Form und läuft nach oben hin schmal zu. Durch diese spezielle Form können sich die Aromen der Spirituose besonders gut im Glas sammeln und an der schmalen Öffnung konzentrieren. So können die verschiedenen Nuancen besser über die Nase wahrgenommen werden – daher auch der Name.</p>
                    </BgImgTextBannerAltStyle>
                    <BgImgTextBannerAltStyle dark={true} right={true} bgImage={'vodka-min.jpg'}>
                        <h2>2. Wodka voraus</h2>
                        <p>Dieser Schritt ist optional, kann aber in den folgenden Schritten helfen, besser die einzelnen Aromanoten der Spirituose besser wahrzunehmen. Hierzu wird ein kleiner Schluck, einer möglichst neutraler und Spirituose wie etwa Wodka möglichst lange im Mund behalten. Der Alkohol soll gut im Mundraum verteilt werden und erst nach etwa einer Minute geschluckt werden. Dies kann durchaus brennen und unangenehm sein, hat jedoch seinen Zweck: Der Alkohol soll die Mundschleimhäute "betäuben" und dadurch für die alkoholische Schärfe der kommenden Destillate weniger empfindlich machen. So können die verschiedenen Aromen besser auf der Zunge wahrgenommen werden.</p>
                    </BgImgTextBannerAltStyle>
                    <BgImgTextBannerAltStyle dark={false} right={false} bgImage={'gincolor-min.jpg'}>
                        <h2>3. Die Sichtprobe</h2>
                        <p>Zunächst wird die Spirituose in das Nosing-Glas gegeben. Wir empfehlen als optimale Menge für das Verkosten etwa mindestens 2cl. Schwenkt man den Gin nun einige Male, bildet sich ein Ring, von dem das Destillat tropfen- oder tränenförmig zurück nach unten ins Glas fließt. Dieser Vorgang sagt etwas über die Viskosität des Gins aus: Schnell abfließende und sich rasch auflösende Tränen weisen auf eine feine Viskosität hin, langsame hingegen auf eine öligere Beschaffenheit. Auch auf die Farbe des Gins kann hier geachtet werden. Eine leichte Färbung kann auf einen Compound Gin oder einen mazeriert Gin hinweisen oder dass der Gin im Fass gereift ist und auf diese Weise Aromen und Farbstoffe aufgenommen hat.</p>
                    </BgImgTextBannerAltStyle>
                    <BgImgTextBannerAltStyle dark={true} right={true} bgImage={'nosing-min.jpg'}>
                        <h2>4. Das Nosing</h2>
                        <p>Das Glas sollte leicht schräge gehalten werden. Beim Riechen den Mund leicht geöffnet lassen und tief einatmen. Dabei ist darauf zu achten, die Nase nicht zu weit in das Glas zu halten, sondern nur knapp darüber. Die Nase nun vom oberen Rand zum unteren Rand des Glases bewegen, um den vollen Aromaumfang wahrnehmen zu können. Oben sind die leichteren und zarten Aromen vorzufinden, am unten die schwereren, alkoholischeren. Zwei Tipps hierzu: Wer sich schwertut den richtigen Abstand zu finden, dem empfehlen wir zunächst weiter weg vom Glas, mit dem riechen anzufangen und in einer sanften Bewegung die Nase zu Glas zu führen, bis der Geruch der Spirituose wahrnehmbar ist. Außerdem riechen die viele Menschen unterschiedlich gut auf verschiedene Nasenlöchern, weswegen es helfen kann, die Nase beim Riechen von einer zur anderen Seite über des Glases zu führen.</p>
                    </BgImgTextBannerAltStyle>
                    <BgImgTextBannerAltStyle dark={false} right={false} bgImage={'tasting-min.jpg'}>
                        <h2>5. Das Verkosten</h2>
                        <p>Nun wird die Spirituose gekostet. Hierbei unterscheiden wir den Geschmack "am Gaumen" und den Nachgeschmack, der nach dem Schlucken entsteht, den "Abgang". Mit einem kleinen Schluck wird der gesamte Mundraum benetzt. Behaltet den Gin einige Momente im Mund und bewegt ihn immer wieder über die Zunge. Um alle Nuancen zu schmecken, sollte dieser Vorgang wiederholt und mehrfach probiert werden. Oft kann man weitere Aromen bessere herausschmecken, wenn man einige wenige Tröpfchen mit der Zungenspitze aufnimmt. Am Gaumen stellen wir uns die Frage, wie süß oder trocken ist der Gin? Welche fruchtigen oder floralen Aroma sind erkennbar? Sind würzige oder scharfe Aromen vorhanden? Beim Abgang hingegen fragen wir uns, wie lange der Geschmack nachhält und welche der Aromen im Mund hinterlassen werden. Das Glas muss hier nicht leer getrunken werden, wenn ihr den Gin noch mit Tonic verkosten möchtet. Mehr dazu im nächsten Abschnitt.</p>
                    </BgImgTextBannerAltStyle>
                    <BgImgTextBannerAltStyle dark={true} right={true} bgImage={'tonic-min.jpg'}>
                        <h2>6. Das Tonic</h2>
                        <p>Beim Tonic gibt es selbstverständlich kein Richtig oder Falsch, denn hier geht es allein um das persönliche Empfinden. Ein passendes Tonic kann man beispielsweise so wählen, dass ein gewünschtes Botanical gezielt unterstützt wird. So kann man ein zitruslastigen Gin mit einem zitruslastigen Tonic gute unterstützen. Ähnlich kann man auch unterschwellige Botanicals weiter in den Vordergrund bringen, beispielsweise bei einem klassischen Gin mit leichten floralen Noten, kann ein blumiges Tonic diese Aromen besser betonen. Wenn verschiedenen Gins verkostet werden, empfiehlt es sich jedoch alle mit dem gleichen, möglichst neutralen Tonic zu vergleichen. Gießt hierzu, zum restlichen Gin, der im Glas verblieben ist, einen Schuss Tonic und wiederholt den Tasting-Schritt.</p>
                    </BgImgTextBannerAltStyle>
                    <BgImgTextBannerAltStyle dark={false} right={false} bgImage={'garnish-min.jpg'}>
                        <h2>7. Die Garnitur</h2>
                        <p>Die Garnitur, auch "Garnish" genannt, ist der krönende Abschluss, die Kirsche auf der Sahnehaube, aber gleichzeitig mehr als nur Dekoration. Die Garnitur erfüllt mehr, als nur den Zweck hübsch auszusehen. Mehr noch als ein Tonic kann die Garnitur dazu beitragen, gewisse Noten des Gins weiter in den Vordergrund zu stellen und zu betonen. Dabei sind kaum Grenzen gesetzt. Als Faustregel empfiehlt es sich aber keine neuen Geschmacksnoten einzubringen, sondern nur bereits vorhandene Aromen zu verstärken. Viele Gin-Hersteller haben hierzu ihre eigenen Empfehlungen, die oft unter dem Stichwort "Perfect-Serve" geführt werden.</p>
                    </BgImgTextBannerAltStyle>
                </section>
            </MotionWrapper>
        );
    }
}

export default HowToTaste;