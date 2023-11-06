import React, {useState, useEffect} from 'react'
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native'
import CountryFlag from 'react-native-country-flag'

import {useTranslation} from 'react-i18next'
import {useSettings} from '../../hooks'
import {useDispatch} from 'react-redux'
import {setLanguage} from '../../store/slices/settingSlice'

const LanguageFlags = () => {
  const {t, i18n} = useTranslation()
  const {language} = useSettings()
  const [toggleLanguage, setToggleLanguage] = useState(false)

  const dispatch = useDispatch()

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------
  useEffect(() => {
    language !== i18n.language && i18n.changeLanguage(language)
  }, [language])

  // ----------------------------------------------------------
  // == HANDLE
  // ----------------------------------------------------------
  const handleChangeLanguage = (lang) => {
    dispatch(setLanguage(lang))
    i18n.changeLanguage(lang)
    setToggleLanguage(false)
  }

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <View style={{marginRight: 10}}>
      <TouchableOpacity onPress={() => setToggleLanguage(!toggleLanguage)}>
        <CountryFlag
          isoCode={language}
          size={25}
          style={{
            borderRadius: 3,
            borderWidth: 0.25,
            borderColor: '#eee'
          }}
        />
      </TouchableOpacity>

      {toggleLanguage && (
        <View
          style={[
            {
              position: 'absolute',
              top: 30,
              right: 0,

              backgroundColor: '#fff',
              padding: 5,
              borderRadius: 5,
              gap: 10
            },
            styles.shadow
          ]}>
          <FlagItem
            lang={language}
            flag="gb"
            text="English"
            handle={() => handleChangeLanguage('gb')}
          />
          <FlagItem
            lang={language}
            flag="th"
            text="Thai"
            handle={() => handleChangeLanguage('th')}
          />

          <FlagItem
            lang={language}
            flag="cn"
            text="Chinese"
            handle={() => handleChangeLanguage('cn')}
          />
        </View>
      )}
    </View>
  )
}

// ----------------------------------------------------------
// == COMPONENT
// ----------------------------------------------------------
const FlagItem = ({lang, text, handle, flag}) => {
  return (
    <TouchableOpacity
      style={[
        styles.row,
        {gap: 8, borderRadius: 3, padding: 3},
        lang === flag && {
          backgroundColor: '#FFD6D6'
        }
      ]}
      onPress={handle}>
      <View style={[styles.row, {gap: 5}]}>
        <CountryFlag isoCode={flag} size={20} style={{borderRadius: 2}} />
        <Text style={{color: '#000'}}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}

// ----------------------------------------------------------
// == STYLE
// ----------------------------------------------------------
const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row'
    // alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  }
})

export default LanguageFlags
