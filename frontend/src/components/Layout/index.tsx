import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/index.tsx';
import Footer from '../Footer/index.tsx';
import * as S from './styles.ts';

const Layout: React.FC = () => {
  return (
    <S.Layout>
      <Header />
      <S.Container>
        <Outlet /> {/* Páginas setadas nas rotas */}
      </S.Container>
      <Footer />
    </S.Layout>
  );
};

export default Layout;
