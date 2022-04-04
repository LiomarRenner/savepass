import { useCallback, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, Text, View } from 'react-native';

import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { HeaderHome } from '../../components/HeaderHome';
import { Card, CardProps } from '../../components/Card';
import { Button } from '../../components/Button';
import { styles } from './styles';

export function Home() {
  const [data, setData] = useState<CardProps[]>([]);

  const { getItem, setItem } = useAsyncStorage('@savepass:passwords');
  
  async function handleFetchData() {
    const response:any = await getItem();
    const data = response ? JSON.parse(response) : [];
    setData(data);
  }

  async function handleRemove(_id: string) {
    const response:any = await getItem();
    const previousData = response ? JSON.parse(response) : [];

    const data = previousData.filter((item:CardProps) => item.id !== _id);
    setItem(JSON.stringify(data));
    setData(data);    
  }

  useFocusEffect(useCallback(() => {
    handleFetchData();
  },[]));

  return (
    <View style={styles.container}>
      <HeaderHome />

      <View style={styles.listHeader}>
        <Text style={styles.title}>
          Suas senhas
        </Text>

        <Text style={styles.listCount}>
          {`${data.length} ao total`}
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) =>
          <Card
            data={item}
            onPress={() => handleRemove(item.id)}
          />
        }
      />

      <View style={styles.footer}>
        <Button
          title="Limpar lista"
        />
      </View>
    </View>
  );
}