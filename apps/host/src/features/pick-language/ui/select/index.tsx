import { Group, Image, Menu, UnstyledButton } from '@mantine/core';
import { i18nService } from '@repo/lib/i18next';
import { assert } from '@repo/lib/typescript';
import { IconChevronDown } from '@tabler/icons-react';
import { type FC, useState } from 'react';
import { useTranslation } from '~/shared/lib/i18next';
import englishImage from './assets/english.png';
import russianImage from './assets/russian.png';
import styles from './styles.module.css';

const data: { language: string; label: string; image: string }[] = [
  {
    language: 'en',
    label: 'common.english',
    image: englishImage,
  },
  {
    language: 'ru',
    label: 'common.russian',
    image: russianImage,
  },
];

export const PickLanguageSelect: FC = () => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);

  const selected = data.find((item) => item.language === i18nService.getCurrentLanguage());
  assert(selected, 'PickLanguageSelect item must be defined');

  const items = data.map((item) => (
    <Menu.Item
      key={item.language}
      leftSection={<Image src={item.image} width={18} height={18} />}
      onClick={() => i18nService.changeLanguage(item.language)}
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
