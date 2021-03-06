import React, { Component } from 'react';

export class RodapePerfil extends Component {
    static displayName = RodapePerfil.name;

    render() {
        return (
            <footer class="relative bottom-0 bg-purple-100 w-full footer text-muted">
                <div className="container mx-auto px-4">
                    <hr className="border-gray-900" />
                    <div className="flex flex-wrap items-center md:justify-between justify-center">
                        <div className="w-full mx-auto text-center">
                            <div className="text-1xl text-gray-600 font-semibold py-2">
                                &copy; 2021 - BlockNotarization
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
