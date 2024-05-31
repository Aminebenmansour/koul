# import os
# from dash import Dash,html

# from dash.dependencies import Output

# # Chemin vers le dossier résultat
# result_folder = 'stage1/ss/semiautorecon/results'

# # Création de l'application Dash
# app = Dash(__name__)

# # Fonction pour récupérer la liste des fichiers dans le dossier résultat
# def get_result_files():
#     return os.listdir(result_folder)

# # Mise en page de l'application Dash
# app.layout = html.Div([
#     html.H1("Contenu du dossier résultat"),
#     html.Ul(id="file-list"),
# ])

# # Mise à jour dynamique de la liste des fichiers
# @app.callback(
#     Dash.dependencies.Output("file-list", "children"),
#     []
# )
# def update_file_list():
#     file_list = get_result_files()
#     print('aamm',file_list)
#     return [html.Li(file) for file in file_list]

# # Exécution de l'application Dash
# if __name__ == "__main__":
#     app.run_server(debug=True)
