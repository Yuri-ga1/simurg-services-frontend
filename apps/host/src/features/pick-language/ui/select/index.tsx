import { type FC, useState } from 'react';
import { Group, Image, Menu, UnstyledButton } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { i18nService } from '@repo/lib/i18next';
import { assert } from '@repo/lib/typescript';
import { useTranslation } from '../../../../shared/lib/i18next';
import { images } from '../assets';
import styles from './styles.module.css';

const data: { locale: string; label: string; image: string }[] = [
  {
    locale: 'en',
    label: 'common.english',
    image: images.english,
  },
  {
    locale: 'ru',
    label: 'common.russian',
    image: images.russian,
  },
];

export const PickLanguageSelect: FC = () => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);

  const selected = data.find((item) => item.locale === i18nService.getCurrentLanguage());
  assert(selected, 'Locale item must be defined');

  const items = data.map((item) => (
    <Menu.Item
      key={item.locale}
      leftSection={<Image src={item.image} width={18} height={18} />}
      onClick={() => i18nService.changeLanguage(item.locale)}
    >
      {t(item.label)}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={styles.control} data-expanded={opened || undefined}>
          <Group>
            <Image src={selected.image} width={22} height={22} />
            <span className={styles.label}>{t(selected.label)}</span>
          </Group>
          <IconChevronDown className={styles.icon} size="1rem" stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
};
