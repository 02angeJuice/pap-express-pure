import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Empty} from '../../components/SpinnerEmpty'
import {useTranslation} from 'react-i18next'
import ModalDetail from '../../components/ModalDetail'
import {useDispatch} from 'react-redux'
import {setfetchfocus} from '../../store/slices/focusSlice'

const ToggleState = {
  DETAIL: 'DETAIL'
}

const TabViewList_2 = ({detail}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [toggleState, setToggleState] = useState(null)
  const [information, setInformation] = useState(null)
  const [expanded, setExpanded] = useState(false)

  const toggleSetState = (newToggleState) => {
    toggleState === newToggleState
      ? setToggleState(newToggleState)
      : setToggleState(null)
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => dispatch(setfetchfocus())}>
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              borderBottomWidth: 0.5,
              borderStyle: 'dashed'
            }
          ]}>
          <View style={{flex: 1, alignItems: 'center', width: '100%'}}>
            <Text style={{color: '#000', fontSize: 20}}>{'#'}</Text>
          </View>
          <View style={{flex: 2, alignItems: 'center', width: '100%'}}>
            <Text style={{color: '#000', fontSize: 16}}>{`${t(
              'tracking_four'
            )}`}</Text>
          </View>
          <View style={{flex: 2, alignItems: 'center', width: '100%'}}>
            <Text style={{color: '#000', fontSize: 16}}>{t('item_no')}</Text>
          </View>
          <View style={{flex: 1, alignItems: 'center', width: '100%'}}>
            <Text style={{color: '#000', fontSize: 16}}>{t('box')}</Text>
          </View>
          <View style={{flex: 2, alignItems: 'center', width: '100%'}}>
            <Text style={{color: '#000', fontSize: 16}}>{t('status')}</Text>
          </View>
          <View style={{flex: 0, alignItems: 'center'}}></View>
        </View>
      </TouchableWithoutFeedback>

      {expanded && (
        <>
          {detail !== null ? (
            <TouchableWithoutFeedback onPress={() => dispatch(setfetchfocus())}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
                style={styles.modalContainer}>
                {detail?.map((item, idx) => (
                  <ScanItem
                    key={idx}
                    item={item}
                    setInformation={setInformation}
                    setToggleState={setToggleState}
                  />
                ))}
              </ScrollView>
            </TouchableWithoutFeedback>
          ) : (
            <Empty text={detail && t('empty')} />
          )}
        </>
      )}

      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={{width: '100%', alignItems: 'center'}}>
        <Ionicons
          name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={25}
          color={'#777'}
        />
      </TouchableOpacity>

      {information && toggleState === ToggleState.DETAIL && (
        <ModalDetail
          data={information}
          visible={toggleState === ToggleState.DETAIL}
          setVisible={() => toggleSetState(null)}
        />
      )}
    </View>
  )
}

// ----------------------------------------------------------
// == COMPONENT
// ----------------------------------------------------------
const ScanItem = React.memo(({item, setInformation, setToggleState}) => {
  return (
    <View
      key={item.row_id}
      style={[
        styles.row,
        {
          justifyContent: 'space-between',
          borderTopWidth: 1,
          borderColor: '#ccc',
          borderStyle: 'dashed'
        }
      ]}>
      <View style={{flex: 0.5, alignItems: 'center', width: '100%'}}>
        <Text style={{color: '#000', fontSize: 16}}>{item.row_id}</Text>
      </View>
      <View style={{flex: 2, alignItems: 'center'}}>
        <Text style={{fontSize: 16, color: '#000'}}>{item.item_serial}</Text>
      </View>
      <TouchableOpacity
        style={{flex: 2, alignItems: 'center'}}
        onPress={() => {
          Clipboard.setString(item.item_no)
          console.log('copy ', item.item_no)
        }}>
        <Text style={{fontSize: 14, color: '#000'}}>{item.item_no}</Text>
      </TouchableOpacity>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text style={{fontSize: 16, color: '#000'}}>{item.qty_box}</Text>
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <View
          style={[
            styles.status,
            item.status === 'PICKED'
              ? styles.PICKED
              : item.status === 'LOADED'
              ? styles.LOADED
              : styles.UNLOAD
          ]}>
          <Text style={{fontSize: 10, color: '#ffff'}}>{item.status}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={{flex: 1, justifyContent: 'center'}}
        onPress={() => {
          setInformation(item)
          setToggleState(ToggleState.DETAIL)
        }}>
        <Ionicons name={'search-circle'} size={35} color={'#777'} />
      </TouchableOpacity>
    </View>
  )
})

// ----------------------------------------------------------
// == STYLES
// ----------------------------------------------------------
const styles = StyleSheet.create({
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10
  },
  modalContainer: {
    flex: 1,
    maxHeight: 300
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    marginTop: 15,

    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  nav: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#AE100F',
    borderRadius: 5
  },
  textNav: {
    flex: 1,
    fontSize: 18,
    color: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10
  },
  closeButton: {
    zIndex: 2,
    position: 'absolute',
    right: 10,
    top: 35,
    transform: [{translateY: -5}]
  },
  button: {
    maxWidth: '100%',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center'
  },
  status: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 50
  },
  PICKED: {
    backgroundColor: '#4AB800',
    color: '#183B00'
  },
  LOADED: {
    backgroundColor: '#009DFF',
    color: '#003F67'
  },
  UNLOAD: {
    backgroundColor: '#FF003C',
    color: '#4A0011'
  }
})

export default React.memo(TabViewList_2)
