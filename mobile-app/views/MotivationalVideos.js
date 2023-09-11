import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, FlatList, ScrollView } from 'react-native';
import color from "../color"
import { Divider, Slider } from 'react-native-elements'
import Hamburger from "../icons/hamburger.svg"
import Logout from "../icons/logout.svg"

import Play from "../icons/play.svg"
import Pause from "../icons/pause.svg"
import Forward5 from "../icons/Forward5.svg"
import Forward10 from "../icons/Forward10.svg"
import Backward5 from "../icons/Backward5.svg"
import Backward10 from "../icons/Backward10.svg"
import X_uno from "../icons/X_uno.svg" // Importa l'icona per la velcità 1X
import X_uno_punto_cinque from "../icons/X_uno_punto_cinque.svg" // Importa l'icona per uscire dal fullscreen
import Dot from "../icons/dry-clean.svg"

import { useTranslation } from 'react-i18next'

import YoutubePlayer from 'react-native-youtube-iframe';
import { get } from "../api/restManager"
import LogoutOverlay from '../components/LogoutOverlay';

export default function MotivationalVideos({ navigation }) {

    const { t } = useTranslation()

    const [overlayLogoutVisible, setOverlayLogoutVisible] = useState(false);

    const [playing, setPlaying] = useState(false);

    const [isFullScreen, setIsFullScreen] = useState(false);

    const [videoId, setVideoId] = useState('');
    const [videos, setVideos] = useState([]);
    const ytplayerRef = useRef(); // Variabile per creare il riferimento con il componente YoutubePlayer
   
    const [value, setValue] = useState(0);//variabile per il valore dello slider
    const [videoDuration, setVideoDuration] = useState(0);//variabile per memorizzare la durata massima del video
    const [playbackRate, setPlaybackRate] = useState(1.0);//variabile per impostare la velocità di riproduzione
     const [simulationRunning, setSimulationRunning] = useState(false);
    let interval;
    useEffect(() => {
        getData()
    }, []);

    useEffect(() => {
        // Chiamata per ottenere la durata del video
        fetchVideoDuration();
    }, [videoId]);

    //funzione per ottenere la durata massima del video corrente
    const fetchVideoDuration = async () => {
        try {
            const duration = await ytplayerRef.current.getDuration();
            setVideoDuration(duration);
        } catch (error) {
            console.error("Errore durante l'ottenimento della durata del video:", error);
        }
    };

   

    async function getData() {
        try {
            let data = await get("/multimedia");
            if (data) {
                setData(data)
            }

        } catch (error) {
            // There was an error on the native side
            console.log("$$ DBG MotivationalVideos getData error", error)
            if (err && err.toString().includes("Signature has expired")) {
                handleLogout()
            }
        }
    }

    const setData = ({ videos }) => {

        let d0 = []

        videos.forEach(element => {
            let new_item = {
                id: element.id,
                link: element.video_link,
                title: element.title,
                description: element.description
            }
            d0.push(new_item)

        })

        d0[0].link.split("/")[2] == "youtu.be" ? setVideoId(d0[0].link.split("/")[3]) : setVideoId(d0[0].link.split("v=")[1])
        setVideos(d0)
    }

    const renderItemList = ({ item, index }) => (
        <ItemList title={item.title} index={index} id={item.id} link={item.link} />
    );

    const ItemList = ({ title, id, link, index }) => (
        <>
            <View style={styles.itemContent} flexDirection={"row"}>
                <View flexDirection={"column"} width={"100%"}>
                    <View marginBottom={20} marginLeft={5} marginRight={5} marginTop={5} flexDirection={"row"} justifyContent={"space-between"}>
                        <Dot style={styles.itemIcon} fill={color.black} />
                        <Text style={styles.itemTextLong}>{title}</Text>
                        <Pressable onPress={() => { link.split("/")[2] == "youtu.be" ? setVideoId(link.split("/")[3]) : setVideoId(link.split("v=")[1]); setPlaying(true) }} android_ripple={{ color: color.lightBlue, borderless: true }} >
                            <Play style={styles.itemIconPlay} />
                        </Pressable>
                    </View>
                </View>
            </View>
            <Divider orientation="horizontal" />
        </>
    );

    

    // Funzione per avanzare il video di 5 secondi 
    const moveForward5 = async () => {
        setPlaying(!playing) // Viene fermata la riproduzione
        const time = await ytplayerRef.current.getCurrentTime(); // Ottengo il tempo corrente 
        await ytplayerRef.current.seekTo(time + 5); // Eseguo l'avanzamento
        setPlaying(playing) // Riprendo l'esecuzione del video
    }

    // Funzione per retrocedere il video di 5 secondi
    const moveBackward5 = async () => {
        setPlaying(!playing)
        const time = await ytplayerRef.current.getCurrentTime();
        await ytplayerRef.current.seekTo(time - 5);
        setPlaying(playing)
    }

    // Funzione per avanzare il video di 10 secondi 
    const moveForward10 = async () => {
        setPlaying(!playing)
        const time = await ytplayerRef.current.getCurrentTime();
        await ytplayerRef.current.seekTo(time + 10);
        setPlaying(playing)
    }

    // Funzione per retrocedere il video di 10 secondi
    const moveBackward10 = async () => {
        setPlaying(!playing)
        const time = await ytplayerRef.current.getCurrentTime();
        const newtime = time - 10;
        await ytplayerRef.current.seekTo(newtime);
        setPlaying(playing)
    }

    //funzione per aggiornare il video in base al valore dello slider
    const slider = async (value) => {
        const duration = await ytplayerRef.current.getDuration();

        const newValue = (duration * value) / 300;
        setValue(value)
        await ytplayerRef.current.seekTo(newValue);

    }



    const toggleOverlayLogOut = () => {
        setOverlayLogoutVisible(!overlayLogoutVisible);
    };

    const togglePlaying = () => {
        setPlaying((prev) => !prev);
    }

    //funzione per modificare la velocità di riproduzione
     const simulateFasterPlayback = () => {
  if (simulationRunning) {
    clearInterval(interval); // Interrompi la simulazione se è in esecuzione
    setSimulationRunning(false);
  } else {
    setPlaying(true); // Avvia la riproduzione
    setSimulationRunning(true); // Imposta la simulazione come in esecuzione
  }
         interval = setInterval(faster, 500);//attivo la riproduzione a 1.5
             
     };
    //funzione che modifica il tempo 
     const faster = async () => {
        const time = await ytplayerRef.current.getCurrentTime();
        const newtime = time +1;
        await ytplayerRef.current.seekTo(newtime);
        
    }
          
          


    return (
        <>
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Pressable onPress={() => (navigation.openDrawer())} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Hamburger style={styles.topBarIcon} />
                    </Pressable>
                    <Text style={styles.topBarText}>{t("nav:motivationalvideos")}</Text>
                    <Pressable onPress={toggleOverlayLogOut} android_ripple={{ color: color.edalabBlue, borderless: false }}>
                        <Logout style={styles.topBarIcon} />
                    </Pressable>
                </View>

                <ScrollView nestedScrollEnabled={true}>

                    {/* VIDEO */}
                    <View style={styles.containerVideo}>
                        <Pressable
                            onPress={() => {
                                // handle or ignore
                            }}
                            onLongPress={() => {
                                // handle or ignore
                            }}>
                            <View pointerEvents="none">
                                <YoutubePlayer
                                    ref={ytplayerRef}//passo il riferimento al video
                                     height={200}
  
                                     play={playing}
                                    videoId={videoId}
                                     playbackRate={playbackRate} // Passo il valore della velocità di riproduzione 
                                     onReady={fetchVideoDuration}
                            />

                            </View>
                        </Pressable>
                    </View>
                    <View style={{
                        alignItems: "center",
                    }}>
                        <Pressable onPress={() => { setPlaying(!playing) }} android_ripple={{ color: color.edalabBlue, borderless: false }}
                            backgroundColor={color.lightBlue} borderRadius={7} width={60} padding={5} alignItems={"center"} margin={10}>
                            {playing ?
                                <Pause height={"25"} width={"40"} fill={"white"} />
                                :
                                <Play height={"25"} width={"40"} fill={"white"} />
                            }
                        </Pressable>
                        {/*pulsante per mandare indietro di 5 secondi */ }
                        <Pressable onPress={moveBackward5} style={styles.videoButtons1} android_ripple={{ color: color.edalabBlue, borderless: false }}
                            backgroundColor={color.lightBlue} borderRadius={7} width={60} padding={5} alignItems={"center"} margin={10}>
                            <Backward5 height={"35"} width={"40"} fill={"black"} />
                        </Pressable>
                        {/*pulsante per mandare indietro di 10 secondi */ }
                        <Pressable onPress={moveBackward10} style={styles.videoButtons2} android_ripple={{ color: color.edalabBlue, borderless: false }}
                            backgroundColor={color.lightBlue} borderRadius={7} width={60} padding={5} alignItems={"center"} margin={10}>
                            <Backward10 height={"35"} width={"40"} fill={"black"} />
                        </Pressable>
                        {/*pulsante per mandare in avanti di 5 secondi */ }
                        <Pressable onPress={moveForward5} style={styles.videoButtons3} android_ripple={{ color: color.edalabBlue, borderless: false }}
                            backgroundColor={color.lightBlue} borderRadius={7} width={60} padding={5} alignItems={"center"} margin={10}>
                            <Forward5 height={"35"} width={"40"} fill={"black"} />
                        </Pressable>
                        {/*pulsante per mandare in avanti di 10 secondi */ }
                        <Pressable onPress={moveForward10} style={styles.videoButtons4} android_ripple={{ color: color.edalabBlue, borderless: false }}
                            backgroundColor={color.lightBlue} borderRadius={7} width={60} padding={5} alignItems={"center"} margin={10}>
                            <Forward10 height={"35"} width={"40"} fill={"black"} />
                        </Pressable>
                        {/*pulsante per modificare la velocità di riproduzione */ }
                       <Pressable
  onPress={simulateFasterPlayback}
  style={styles.speed}
  android_ripple={{ color: color.edalabBlue, borderless: false }}
  backgroundColor={color.white}
  borderRadius={7}
                            width={60}
                            
  padding={5}
  alignItems={"center"}
  margin={10}
>
  {simulationRunning ? (
    <X_uno height={"35"} width={"40"} fill={"white"} />
  ) : (
    <X_uno_punto_cinque height={"35"} width={"40"} fill={"white"} />
  )}
</Pressable>
{/*slider per scorrere il video */ }
                        <Slider
                            style={{ width: 300, height: 40 }}
                            value={value}
                            minimumValue={0}
                            maximumValue={300}
                            onValueChange={(value) => slider(value)}
                            valueLabelDisplay="auto"
                            size="small"
                        />
                        {/*testo che permette di visualizzare il minuti a cui si sta spostando il video e la durata totale */ }
                        <Text>
                            {`${(((value * videoDuration) / 300) / 60).toFixed(2)}  / ${(videoDuration / 60).toFixed(2)} min`}
                        </Text>
                        
                    </View>

                    {/* VIDEO LIST */}
                    <View style={styles.card}>
                        <SafeAreaView style={styles.contentCardContainer}>
                            <FlatList
                                data={videos}
                                renderItem={renderItemList}
                                keyExtractor={item => item.id}
                                nestedScrollEnabled={true}
                            />
                        </SafeAreaView>
                    </View>

                    <LogoutOverlay overlayLogoutVisible={overlayLogoutVisible} setOverlayLogoutVisible={setOverlayLogoutVisible} navigation={navigation} />
                </ScrollView>

            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
        paddingBottom: 20,
    },
    topBar: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: color.lightBlue,
        padding: 10,
    },
    topBarText: {
        color: color.white,
        fontSize: 25,
        fontWeight: "bold",
    },
    topBarIcon: {
        width: 35,
        height: 35,
        color: color.white,
    },
    contentCardContainer: {
        margin: 15,
    },
    card: {
        backgroundColor: color.white,
        marginTop: 20,
        margin: 10,
        borderRadius: 7,
        borderColor: color.gray,
        borderWidth: 1,
        height: 300
    },
    cardTitle: {
        color: color.black,
        fontSize: 20,
        fontWeight: "bold",
    },
    itemContent: {
        marginTop: 18,
        backgroundColor: color.white,
    },
    itemTextLong: {
        color: color.black,
    },
     itemTextShort: {
        color: color.black,
    },
    itemIcon: {
        width: 8,
        height: 8,
        color: color.black,
        marginTop: 7,
    },
    itemIconPlay: {
        width: 25,
        height: 25,
        color: color.black,
    },
    containerVideo: {
        padding: 3,
        backgroundColor: color.black,
        margin: 10,
        borderRadius: 7,
        borderColor: color.gray,
        borderWidth: 1,
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoButtons1: {
        borderRadius: 7,
        width: 60,
        padding: 2, 
        marginLeft: -130,
        marginTop: -47,
        marginBottom:5
    },
     videoButtons2: {
        borderRadius: 7,
        width: 60,
        padding: 2, 
        marginLeft: -270,
        marginTop: -44,
        marginBottom:5
    },
      videoButtons3: {
        borderRadius: 7,
        width: 60,
        padding: 2, 
        marginLeft: 150,
        marginTop: -44,
        marginBottom:5
    },
       videoButtons4: {
        borderRadius: 7,
        width: 60,
        padding: 2, 
        marginLeft: 290,
        marginTop: -44,
        marginBottom:5
    },
    speed: {
        borderRadius: 7,
        width: 60,
        padding: 2, 
        marginLeft: 290,
        marginTop: 0,
        marginBottom: 5
       },
    row: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        marginBottom: 5,
        color: color.black,
        backgroundColor: color.black
    },
});