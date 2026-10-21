import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card, EmptyState, Heading, Pill, Screen } from '@/components/planner-ui';
import { usePlanner } from '@/lib/store';
import { useAccent, usePalette } from '@/lib/theme';
import { DAYS } from '@/lib/types';

export default function ScheduleScreen() {
  const c = usePalette(); 
  const accent = useAccent(); 
  const { classes } = usePlanner();

  // Seleccionar automáticamente el día de hoy o 'Lunes' si es fin de semana
  const initialDay = useMemo(() => {
    const todayIndex = (new Date().getDay() + 6) % 7; // Convertir domingo (0) -> 6, lunes (1) -> 0
    return todayIndex < 5 ? DAYS[todayIndex] : 'Lunes';
  }, []);

  const [selected, setSelected] = useState(initialDay);

  const entries = useMemo(
    () => classes.filter((item) => item.day === selected).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [classes, selected]
  );

  return (
    <Screen>
      <Heading 
        title="Mi horario" 
        subtitle="Tu semana, con espacio para todo." 
        right={
          <Link href="/class/new" asChild>
            <Pressable style={{ backgroundColor: accent, borderRadius: 14, paddingHorizontal: 15, paddingVertical: 11 }}>
              <Text style={{ color: '#fff', fontWeight: '800' }}>＋ Clase</Text>
            </Pressable>
          </Link>
        } 
      />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
        {DAYS.map((day) => (
          <Pill key={day} label={day.slice(0, 3)} selected={day === selected} onPress={() => setSelected(day)} />
        ))}
      </View>

      <Heading title={selected} subtitle={`${entries.length} ${entries.length === 1 ? 'clase' : 'clases'}`} />

      {entries.length ? (
        entries.map((item) => (
          <Link key={item.id} href={{ pathname: '/class/[id]', params: { id: item.id } }} asChild>
            <Pressable>
              <Card style={{ flexDirection: 'row', gap: 13, alignItems: 'center', padding: 16 }}>
                <View style={{ alignItems: 'center', minWidth: 58 }}>
                  <Text style={{ color: accent, fontWeight: '800' }}>{item.startTime}</Text>
                  <View style={{ height: 18, width: 1, backgroundColor: c.line, marginVertical: 3 }} />
                  <Text style={{ color: c.muted, fontSize: 12 }}>{item.endTime}</Text>
                </View>
                <View style={{ width: 4, height: 48, backgroundColor: accent, borderRadius: 4 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: c.text, fontSize: 16, fontWeight: '700' }}>{item.subject}</Text>
                  <Text style={{ color: c.muted, fontSize: 12, marginTop: 5 }}>{item.room || 'Salón por definir'}</Text>
                </View>
                <Text style={{ color: c.muted }}>›</Text>
              </Card>
            </Pressable>
          </Link>
        ))
      ) : (
        <EmptyState title="Día libre" subtitle="No tienes clases este día. Puedes añadir una cuando quieras." />
      )}
    </Screen>
  );
}