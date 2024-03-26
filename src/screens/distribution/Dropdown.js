import React from 'react'
import {StyleSheet} from 'react-native'
import {IndexPath, Layout, Select, SelectItem} from '@ui-kitten/components'

export const Dropdown = ({list}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const displayValue = list?.[selectedIndex.row]

  const renderOption = (title) => <SelectItem title={title} />

  return (
    <Layout style={styles.container} level="1">
      <Select
        style={styles.select}
        placeholder="Default"
        value={displayValue}
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}>
        {list?.map(renderOption)}
      </Select>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  select: {
    flex: 1,
    color: 'red',
    // margin: 2,
    borderRadius: 10
  }
})
