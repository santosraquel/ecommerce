import React  from 'react';
import '../src/assets/layout/AppTopBar.css';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { LoginService } from './service/util/LoginService';

export const AppTopbar = (props) => {

    const loginService = new LoginService();

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={props.layoutColorMode === 'light' ? 'images/blocks/logos/logo4.png' : ''} alt="logo" height="200" className='img'/>
                <span>Rosa Neon</span>
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars"/>
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

                <ul className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                    <li>
                        <button className="p-link layout-topbar-button" onClick={()=>loginService.sair()}>
                            <i className="pi pi-sign-out"></i>
                            <span>Sair</span>
                        </button>
                    </li>
                </ul>
        </div>
    );
}
