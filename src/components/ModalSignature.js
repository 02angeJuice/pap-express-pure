import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import Signature from 'react-native-canvas-signature';
import {useTranslation} from 'react-i18next';

const ModalSignature = ({set, visible, setVisible}) => {
  const {t} = useTranslation();

  const handleOK = sign => {
    const dataType = sign.split(';')[0];
    const fileType = sign.split(';')[0].split('/')[1];

    const path = FileSystem.cacheDirectory + `${sign.slice(-20)}.${fileType}`;
    FileSystem.writeAsStringAsync(
      path,
      sign.replace(`${dataType};base64,`, ''),
      {encoding: FileSystem.EncodingType.Base64},
    )
      .then(() => FileSystem.getInfoAsync(path))
      .then(data => {
        set(data.uri);
      })
      .catch(console.error);
  };

  return (
    <Modal
      isVisible={visible}
      animationInTiming={1}
      animationOutTiming={1}
      onBackButtonPress={() => setVisible(!visible)}>
      <View style={styles.container}>
        <View style={styles.nav}>
          <Text style={styles.textNav}>{t('signature')}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVisible(!visible)}>
            <Ionicons name="close" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginVertical: 5,
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: '#fff',
            borderRadius: 5,
          }}>
          {Platform.OS === 'android' ? (
            <Signature lineWidth={1.5} lineColor="#000" onChange={handleOK} />
          ) : (
            <View style={[styles.row, {gap: 5}]}>
              <Text>{t('signature_support')}</Text>
              {/* <TouchableOpacity>
                                <Text>Skip</Text>
                            </TouchableOpacity> */}
            </View>
          )}
        </View>

        <View>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: '#ABFC74'}]}
            onPress={() => setVisible(!visible)}>
            <Text
              style={[
                {
                  color: '#183B00',
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
              ]}>
              {t('confirm')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 5,
    overflow: 'hidden',
  },
  nav: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#AE100F',
    borderRadius: 5,
  },
  textNav: {
    flex: 1,
    fontSize: 18,
    color: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  closeButton: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  button: {
    maxWidth: '100%',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
});

export default React.memo(ModalSignature);
