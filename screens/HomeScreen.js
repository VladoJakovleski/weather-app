import {View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView} from 'react-native'
import React, {useEffect, useState} from 'react'
import {StatusBar} from "expo-status-bar";
import {MagnifyingGlassIcon, XMarkIcon} from 'react-native-heroicons/outline'
import {MapPinIcon, CalendarDaysIcon} from 'react-native-heroicons/solid'
import {fetchLocations, fetchWeatherForecast} from "../api/weather";
import {weatherImages} from "../constants/mainConstants";
import moment from "moment";
import * as Progress from 'react-native-progress';

export default function HomeScreen(){
    const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState({})
    const [loading, setLoading] = useState(true)
    const handleLocation = (loc) =>{
        setLocations([])
        toggleSearch(false)
        setLoading(true)
        fetchWeatherForecast({
            cityName: loc.name,
            days:'3'
        }).then(data=>{
            setWeather(data)
            setLoading(false)
        })
    }
    const handleSearch = value=>{
        if(value.length>1){
            fetchLocations({cityName: value}).then(data=>{
                setLocations(data)
            })
        }
    }
    useEffect(() => {
        fetchMyWeatherData();
    }, []);
    const fetchMyWeatherData = async ()=>{
        fetchWeatherForecast({
            cityName: 'Skopje',
            days: '3'
        }).then(data=>{
            setWeather(data)
            setLoading(false)
        })
    }
    const {current, location} = weather

    const isDay = current?.is_day
    //const isDay = 0

    return(
        <View className='flex-1 relative'>
            <StatusBar style='light'/>
            <Image
                blurRadius={50}
                source={isDay ? require('../assets/images/bg-day2.jpg') : require('../assets/images/bg-night2.jpg')}
                className='absolute h-full w-full'/>
            {loading? (
                <View className='flex-1 flex-row justify-center items-center'>
                    <Progress.CircleSnail thickness={7} size={140} color="#D2FFE6" spinDuration={555} strokeCap={"butt"}/>
                </View>
                )
                :(
                    <SafeAreaView className='absolute mt-10 flex flex-1'>
                        {/*search*/}
                        <View style={{height: '7%'}} className='mx-4 relative z-50'>
                            <View
                                style={{backgroundColor: showSearch?'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0)'}}
                                className={showSearch
                                    ? 'flex-row justify-end items-center rounded-full bg-opacity-25 border border-white'
                                    : 'flex-row justify-end items-center rounded-full bg-opacity-25'}>
                                {
                                    showSearch? (
                                        <TextInput
                                            onChangeText={handleSearch}
                                            placeholder='Search City'
                                            cursorColor='white'
                                            placeholderTextColor={'lightgrey'}
                                            disableFullscreenUI={true}
                                            className='text-white pl-6 h-10 pb-1 flex-1 text-base'/>

                                    ):null
                                }
                                <TouchableOpacity
                                    onPress={()=> toggleSearch(!showSearch)}
                                    className='rounded-full p-3 m-1'>
                                    {showSearch?<XMarkIcon size='20' color='white'/>:<MagnifyingGlassIcon size='20' color='white'/>}
                                </TouchableOpacity>
                            </View>
                            {
                                locations.length>0 && showSearch?(
                                    <View className='absolute w-full bg-gray-300 top-16 rounded-3xl'>
                                        {
                                            locations.map((loc, index)=>{
                                                return (
                                                    <TouchableOpacity
                                                        onPress={()=> handleLocation(loc)}
                                                        key={index}
                                                        className='flex-row items-center p-3 px-4 mb-1'>
                                                        <MapPinIcon size={20} color='gray'/>
                                                        <Text className='text-black text-xl ml-2'>
                                                            {loc?.name}, {loc?.country}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                ):null
                            }
                        </View>

                        <View /*FORECAST SECTION*/
                            className='mx-2 flex-1 mt-4'>
                            <Text /* LOCATION */
                                className='text-white text-center text-2xl font-bold'>
                                {location?.name},
                                <Text
                                    className='text-lg font-semibold text-gray-300'>
                                    {' '+location?.country}
                                </Text>
                            </Text>

                            <View /* IMAGE */
                                className='flex-row justify-center my-8'>
                                <Image
                                    className='h-48 w-48'
                                    blurRadius={showSearch? 10:0}
                                    source={weatherImages[current?.condition?.text]}/>
                            </View>

                            <View /*CELSIUS*/
                                className='space-y-1'>
                                <Text className='text-center font-bold text-white text-5xl'>
                                    {current?.temp_c}&#176;
                                </Text>
                                <Text className='text-center italic text-white text-xl tracking-widest mb-6'>
                                    {current?.condition?.text}
                                </Text>
                            </View>

                            <ScrollView /* OTHER */
                                horizontal
                                contentContainerStyle={{paddingHorizontal: 15}}
                                showsHorizontalScrollIndicator={false}
                                className='flex-row m-4 space-x-6'>
                                <View className='flex-row space-x-2 items-center'>
                                    <Image source={require('../assets/icons/wind.png')} className='w-6 h-6'/>
                                    <Text className='text-white font-semibold text-base'>{current?.wind_kph} km/h</Text>
                                </View>
                                <View className='flex-row space-x-2 items-center'>
                                    <Image source={require('../assets/icons/drop.png')} className='w-6 h-6'/>
                                    <Text className='text-white font-semibold text-base'>{current?.humidity}%</Text>
                                </View>
                                <View className='flex-row space-x-0 items-center'>
                                    <Image source={require('../assets/icons/pm_icon_25.png')} className='w-10 h-10'/>
                                    <Text className={`text-white font-semibold text-base`}>{current?.air_quality?.pm2_5} μg/m3</Text>
                                </View>
                                <View className='flex-row space-x-0 items-center'>
                                    <Image source={require('../assets/icons/pm_icon_10.png')} className='w-10 h-10'/>
                                    <Text className='text-white font-semibold text-base'>{current?.air_quality?.pm10} μg/m3</Text>
                                </View>
                                <View className='flex-row space-x-1 items-center'>
                                    <Image source={require('../assets/icons/co2.png')} className='w-8 h-8'/>
                                    <Text className='text-white font-semibold text-base'>{current?.air_quality?.co} μg/m3</Text>
                                </View>
                                <View className="flex-row space-x-2 items-center">
                                    <Image source={require('../assets/icons/sun.png')} className="w-6 h-6" />
                                    <Text className="text-white font-semibold text-base">{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                                </View>
                            </ScrollView>

                            <View /*FORECAST*/
                                className='mt-8 space-y-5'>
                                <View className='flex-row items-center mx-4 space-x-2'>
                                    <CalendarDaysIcon size={25} color={'white'}/>
                                    <Text className='text-white text-base'>Daily Forecast</Text>
                                </View>
                                <View className='flex-row items-center mx-5 space-x-1'>
                                    {
                                        weather?.forecast?.forecastday?.map((item, index)=>{
                                            let dateToDay = moment(item.date).format("dddd");
                                            return(
                                                <View
                                                    key={index}
                                                    className='flex justify-center items-center w-28 rounded-3xl py-3 space-y-1 mr-2'
                                                    style={{backgroundColor: 'rgba(255, 255, 255, 0.15)'}}>
                                                    <Image className='w-10 h-10 ' source={weatherImages[item?.day?.condition?.text]}/>
                                                    <Text className='text-white'>{dateToDay}</Text>
                                                    {/*<Text className='text-white'>{item?.day?.condition?.text}</Text>*/}
                                                    <View className='flex flex-row justify-center'>
                                                        <Text className='text-orange-100 font-bold text-xl '>{item?.day?.maxtemp_c}&#176; {" "}</Text>
                                                        <Text className='text-cyan-100 italic text-xs font-bold'>{item?.day?.mintemp_c}&#176;</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                        </View>
                    </SafeAreaView>
                )
            }
        </View>
    )
}